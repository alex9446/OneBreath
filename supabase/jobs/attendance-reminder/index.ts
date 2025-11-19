import { createClient } from '@supabase/supabase-js'
import { setVapidDetails, sendNotification, type SendResult } from 'web-push'
import { Database } from '../_shared/database.types.ts'

console.info(`Job "attendance-reminder" started!`)


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

setVapidDetails(
  'https://github.com/alex9446/OneBreath',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

const { data, error } = await supabaseAdmin.from('subscriptions')
  .select('id,subscription_json')
if (error) {
  console.error(error)
  Deno.exit(1)
}

const updateLastStatusCode = async (subscriptionId: string, code: number = 1) => {
  const { error } = await supabaseAdmin.from('subscriptions')
    .update({ last_status_code: code }).eq('id', subscriptionId)
  if (error) throw error
}

for (const subscription of data) {
  const subscription_json = subscription.subscription_json?.toString()
  if (!subscription_json) {
    console.warn('empty subscription:', subscription.id)
    continue
  }

  sendNotification(
    JSON.parse(subscription_json),
    'Eri presente in piscina? Segna la presenza!',
    { TTL: 60*60*12 } // 12 hours
  ).then((result: SendResult) => { throw result }).catch(
    (result: SendResult) => updateLastStatusCode(subscription.id, result.statusCode)
  ).catch((error: unknown) => {
    console.warn('during subscription:', subscription.id)
    console.warn(error)
  })
}
