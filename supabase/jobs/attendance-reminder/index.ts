import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../_shared/database.types.ts'

const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SECRET_FUNCTIONS_KEY!
)

webpush.setVapidDetails(
  'https://github.com/alex9446/OneBreath',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

const { data: subscriptions, error } = await supabaseAdmin.from('subscriptions').select('*')
if (error) process.exit(error.message)

for (const subscription of subscriptions) {
  const subscription_json = subscription.subscription_json?.toString()
  if (!subscription_json) {
    console.warn('empty subscription: ', subscription.id)
    continue
  }

  let push_status_code = -1
  try {
    push_status_code = (await webpush.sendNotification(
      JSON.parse(subscription_json),
      'Eri presente in piscina? Segna la presenza!',
      { TTL: 60*60*12 } // 12 hours
    )).statusCode
  } catch (error) {
    console.error('when push error, subscription: ', subscription.id)
    console.error(error)
  }

  try {
    const { error } = await supabaseAdmin.from('subscriptions')
      .update({ last_status_code: push_status_code }).eq('id', subscription.id)
  } catch (error) {
    console.error('when update last_status_code, subscription: ', subscription.id)
    console.error(error)
  }
}
