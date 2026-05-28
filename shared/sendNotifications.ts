import { setVapidDetails, sendNotification } from 'web-push'
import type { PushSubscription, SendResult } from 'web-push'
import type { SupabaseClientDB } from './shortcut.types.ts'
import { NotificationPayload } from './generic.types.ts'
import nowInRome from './nowInRome.ts'

const sendNotifications = async (supabaseAdmin: SupabaseClientDB, userIds: string[],
                                 payload: NotificationPayload, ttl?: number) => {
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
  const unique_uid = Array.from(new Set(subscriptions.data.map((s) => s.user_id)))
  console.info(unique_uid.length + ' users can be notified')
  console.info(subscriptions.data.length + ' notifications to send')

  const updateLastStatusCode = async (subscriptionId: string,
                                      subscriptionLSC: number | null, // Last Status Code
                                      currentStatusCode: number) => {
    if (subscriptionLSC === 410 && currentStatusCode === 410) { // subscription definitely gone
      const { error } = await supabaseAdmin.from('subscriptions')
        .delete().eq('id', subscriptionId)
      if (error) throw error
    } else {
      const last_send_at = new nowInRome().toString()
      const { error } = await supabaseAdmin.from('subscriptions')
        .update({ last_status_code: currentStatusCode, last_send_at }).eq('id', subscriptionId)
      if (error) throw error
    }
  }

  for (const subscription of subscriptions.data) {
    sendNotification(
      subscription.subscription_json,
      JSON.stringify(payload),
      { TTL: ttl ?? 60*60*12 } // 12 hours
    ).then((result: SendResult) => { throw result }).catch((result: SendResult) => {
      // updateLastStatusCode(subscription.id, subscription.last_status_code, result.statusCode || 1)
      updateLastStatusCode(subscription.id, null, result.statusCode || 1) // TEMPORARY to not trigger deletion in case of error 410
      if (!result.statusCode) throw result
    }).catch((error: unknown) => {
      console.warn('during subscription:', subscription.id)
      console.warn(error)
    })
  }
}

export default sendNotifications
