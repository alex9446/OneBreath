import { setVapidDetails, sendNotification, type PushSubscription } from 'web-push'
import type { SupabaseClientDB } from './shortcut.types.ts'
import { NotificationPayload } from './generic.types.ts'

const sendNotifications = async (supabaseAdmin: SupabaseClientDB, userIds: string[],
                                                               // 60*60*12 = 12 hours
                                 payload: NotificationPayload, ttl: number = 60*60*12) => {
  setVapidDetails(
    'https://github.com/alex9446/OneBreath',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  )

  // get who can be notified
  const subscriptions = await supabaseAdmin.from('subscriptions')
    .select('id,subscription_json,user_id,last_status_code').in('user_id', userIds)
    .overrideTypes<Array<{ subscription_json: PushSubscription }>>()
  if (subscriptions.error) throw subscriptions.error
  const uniqueUIDs = Array.from(new Set(subscriptions.data.map((s) => s.user_id)))
  console.info(uniqueUIDs.length + ' users can be notified')
  console.info(subscriptions.data.length + ' notifications to send')

  const updateLastStatusCode = async (subscriptionId: string,
                                      subscriptionLSC: number | null, // Last Status Code
                                      currentStatusCode: number) => {
    if (subscriptionLSC === 410 && currentStatusCode === 410) { // subscription definitely gone
      const { error } = await supabaseAdmin.from('subscriptions')
        .delete().eq('id', subscriptionId)
      if (error) throw error
    } else {
      const last_send_at = Temporal.Now.zonedDateTimeISO('Europe/Rome').toString({ timeZoneName: 'never' })
      const { error } = await supabaseAdmin.from('subscriptions')
        .update({ last_status_code: currentStatusCode, last_send_at }).eq('id', subscriptionId)
      if (error) throw error
    }
  }

  const notificationProm = subscriptions.data.map(async (subscription) => {
    let statusCode = 1
    try {
      const result = await sendNotification(subscription.subscription_json,
                                            JSON.stringify(payload), { TTL: ttl })
      throw result
    } catch (result: unknown) {
      try {
        if (typeof result === 'object' && result !== null && 'statusCode' in result &&
            typeof result.statusCode === 'number') {
          statusCode = result.statusCode
        }
        await updateLastStatusCode(subscription.id, subscription.last_status_code, statusCode)
        if (statusCode === 1) throw result
      } catch (error: unknown) {
        console.warn('during subscription:', subscription.id)
        console.warn(error)
      }
    }
    if (statusCode === 201) return subscription.user_id
  })

  const usersSuccessfullyNotified = await Promise.all(notificationProm)
  return new Set(usersSuccessfullyNotified.filter((userId) => userId !== undefined))
}

export default sendNotifications
