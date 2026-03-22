import { setVapidDetails, sendNotification, type SendResult } from 'web-push'
import type { SupabaseClientDB } from './shortcut.types.ts'
import nowInRome from './nowInRome.ts'

const sendNotifications = async (supabaseAdmin: SupabaseClientDB,
                                 userIds: string[], payload: string, ttl?: number) => {
  setVapidDetails(
    'https://github.com/alex9446/OneBreath',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  )

  // get who can be notified
  const subscriptions = await supabaseAdmin.from('subscriptions')
    .select('id,subscription_json,user_id').in('user_id', userIds)
  if (subscriptions.error) throw subscriptions.error
  const unique_uid = Array.from(new Set(subscriptions.data.map((s) => s.user_id)))
  console.info(unique_uid.length + ' users can be notified')
  console.info(subscriptions.data.length + ' notifications to send')

  const updateLastStatusCode = async (subscriptionId: string, code: number = 1) => {
    const last_send_at = new nowInRome().toString()
    const { error } = await supabaseAdmin.from('subscriptions')
      .update({ last_status_code: code, last_send_at }).eq('id', subscriptionId)
    if (error) throw error
  }

  for (const subscription of subscriptions.data) {
    const subscription_json = subscription.subscription_json?.toString()
    if (!subscription_json) {
      console.warn('empty subscription:', subscription.id)
      continue
    }

    sendNotification(
      JSON.parse(subscription_json),
      payload,
      { TTL: ttl ?? 60*60*12 } // 12 hours
    ).then((result: SendResult) => { throw result }).catch(
      (result: SendResult) => updateLastStatusCode(subscription.id, result.statusCode)
    ).catch((error: unknown) => {
      console.warn('during subscription:', subscription.id)
      console.warn(error)
    })
  }
}

export default sendNotifications
