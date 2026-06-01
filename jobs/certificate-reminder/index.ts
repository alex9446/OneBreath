import { createClient } from '@supabase/supabase-js'
import { Database } from '@shared/database.types.ts'
import nowInRome from '@shared/nowInRome.ts'
import sendNotifications from '@shared/sendNotifications.ts'

console.info(`Job "certificate-reminder" started!`)


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_JOBS_KEY')!
)

const NIR = new nowInRome()

// The reason I didn't use Promise.all in this case is that type narrowing isn't supported
// https://github.com/supabase/supabase-js/pull/2264
const profiles = await supabaseAdmin.from('profiles')
  .select('id,certificate_last_reminder').not('certificate_last_reminder', 'is', null)
const certificates = await supabaseAdmin.from('certificates')
  .select('user_id,expiration').lt('expiration', NIR.plainDate)

if (profiles.error) throw profiles.error
if (certificates.error) throw certificates.error

console.info(certificates.data.length + ' expired certificates')

const lastReminderByUserId = new Map(profiles.data.map((profile) => (
  [profile.id, profile.certificate_last_reminder]
)))

const userToNotify = certificates.data.filter((certificate) => {
  const lastReminder = lastReminderByUserId.get(certificate.user_id)
  if (!lastReminder) return true
  // or if the reminder is older than the expiration
  return Temporal.PlainDate.compare(certificate.expiration, lastReminder) > 0
}).map((certificate) => certificate.user_id)

console.info(userToNotify.length + ' users need to be notified')

if (userToNotify.length < 1) {
  console.info(`Job "certificate-reminder" finished! early exit`)
  Deno.exit()
}

const successfullyNotified = await sendNotifications(
  supabaseAdmin, userToNotify,
  {
    title: 'Il tuo certificato è scaduto!',
    body: 'Carica il nuovo 💪',
    url: '/sportexam/uploadcertificate'
  },
  60*60*24*7  // TTL 7 days
)

await supabaseAdmin.from('profiles')
  .update({ certificate_last_reminder: NIR.plainDate })
  .in('id', [...successfullyNotified])

console.info(`Job "certificate-reminder" finished!`)
