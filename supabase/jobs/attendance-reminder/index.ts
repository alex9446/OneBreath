import { createClient } from '@supabase/supabase-js'
import { setVapidDetails, sendNotification, type SendResult } from 'web-push'
import { Database } from '../_shared/database.types.ts'
import nowInRome from "./nowInRome.ts";

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

const NIR = new nowInRome()

// get active groups in current day of week
const groups = await supabaseAdmin.from('groups')
  .select('id').contains('days_of_week', [NIR.dayOfWeek])
if (groups.error) throw groups.error
const groups_ids = groups.data.map((group) => group.id)
console.info(groups_ids.length + ' active groups')

// get who already set attendance
const attendances = await supabaseAdmin.from('attendances')
  .select('user_id').eq('marked_day', NIR.plainDate)
if (attendances.error) throw attendances.error
const ASA_users_ids = attendances.data.map((attendance) => attendance.user_id)
console.info(ASA_users_ids.length + ' users already set attendance')

// get profiles of active groups (exclude who already set attendance)
const profiles = await supabaseAdmin.from('profiles')
  .select('id').in('group_id', groups_ids).not('id', 'in', `(${ASA_users_ids.join(',')})`)
if (profiles.error) throw profiles.error
const NSA_profiles_ids = profiles.data.map((profile) => profile.id)
console.info(NSA_profiles_ids.length + ' users have not set attendance')

// get who can be notified
const subscriptions = await supabaseAdmin.from('subscriptions')
  .select('id,subscription_json,user_id').in('user_id', NSA_profiles_ids)
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
    'Eri presente in piscina? Segna la presenza!',
    { TTL: 60*60*12 } // 12 hours
  ).then((result: SendResult) => { throw result }).catch(
    (result: SendResult) => updateLastStatusCode(subscription.id, result.statusCode)
  ).catch((error: unknown) => {
    console.warn('during subscription:', subscription.id)
    console.warn(error)
  })
}
