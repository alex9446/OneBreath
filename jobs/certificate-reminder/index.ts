import { createClient } from '@supabase/supabase-js'
import { getDenoEnv, sendHeartbeat } from '@shared/mixed.ts'
import { Database } from '@shared/database.types.ts'
import sendNotifications from '@shared/sendNotifications.ts'

console.info(`Job "certificate-reminder" started!`)
await sendHeartbeat(true)

const supabaseAdmin = createClient<Database>(
  getDenoEnv('SUPABASE_URL'),
  getDenoEnv('SECRET_JOBS_KEY')
)

const today = Temporal.Now.plainDateISO('Europe/Rome')
const oneMonthAgo = today.subtract({ months: 1 }).toString()

// get excluded groups
const groupsProm = supabaseAdmin.from('groups')
  .select('id').contains('disabled_reminders', ['certificate'])
// get certificates with expiration date
const certificatesProm = supabaseAdmin.from('certificates')
  .select('user_id,expiration')

const [groups, certificates] = await Promise.all([groupsProm, certificatesProm])
if (groups.error) throw groups.error
if (certificates.error) throw certificates.error

const excludedGroups = groups.data.map((group) => group.id)

const certificatesGrouped = Object.groupBy(certificates.data, ({ expiration }) => (
  Temporal.PlainDate.compare(today, expiration) > 0 ? 'expired' : 'valid'
))

console.info(certificatesGrouped.expired?.length + ' expired certificates')

const usersByCertificateStatus = Object.fromEntries(
  Object.entries(certificatesGrouped).map(([status, certificates]) => (
    [status, certificates.map((c)=> c.user_id)]
  ))
) as Record<'expired' | 'valid', string[]>

const notifiableProfiles = await supabaseAdmin.from('profiles')
  .select('id')
  // exclude those who have been notified in the last month
  .or(`certificate_last_reminder.is.null,certificate_last_reminder.lt.${oneMonthAgo}`)
  // exclude those who hold a valid certificate
  .not('id', 'in', `(${usersByCertificateStatus.valid.join(',')})`)
  // exclude those who belong to an excluded group
  .not('group_id', 'in', `(${excludedGroups.join(',')})`)
if (notifiableProfiles.error) throw notifiableProfiles.error

console.info(notifiableProfiles.data.length + ' users need to be notified')

if (notifiableProfiles.data.length < 1) {
  await sendHeartbeat()
  console.info(`Job "certificate-reminder" finished! early exit`)
  Deno.exit()
}

const notifiableProfilesGrouped = Object.groupBy(
  notifiableProfiles.data.map(({ id }) => id),
  (id) => usersByCertificateStatus.expired.includes(id) ? 'expired' : 'absent'
)

const expiredSuccessfullyNotified = await sendNotifications(
  supabaseAdmin, notifiableProfilesGrouped.expired ?? [],
  {
    title: 'Il tuo certificato è scaduto!',
    body: 'Carica il nuovo 💪',
    url: '/sportexam/uploadcertificate'
  },
  60*60*24*7  // TTL 7 days
)

const absentSuccessfullyNotified = await sendNotifications(
  supabaseAdmin, notifiableProfilesGrouped.absent ?? [],
  {
    title: 'Dove hai messo il certificato? 👀',
    body: 'Caricalo ora! 💪',
    url: '/sportexam/uploadcertificate'
  },
  60*60*24*7  // TTL 7 days
)

const { error: updateError } = await supabaseAdmin.from('profiles')
  .update({ certificate_last_reminder: today.toString() })
  .in('id', [...expiredSuccessfullyNotified, ...absentSuccessfullyNotified])
if(updateError) throw updateError

await sendHeartbeat()
console.info(`Job "certificate-reminder" finished!`)
