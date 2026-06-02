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

const certificates = await supabaseAdmin.from('certificates')
  .select('user_id,expiration')
if (certificates.error) throw certificates.error

const certificatesGrouped = Object.groupBy(certificates.data, ({ expiration }) => (
  Temporal.PlainDate.compare(NIR.plainDate, expiration) > 0 ? 'expired' : 'valid'
))

console.info(certificatesGrouped.expired?.length + ' expired certificates')

const usersByCertificateStatus = Object.fromEntries(
  Object.entries(certificatesGrouped).map(([status, certificates]) => (
    [status, certificates.map((c)=> c.user_id)]
  ))
) as Record<'expired' | 'valid', string[]>

const oneMonthAgo = NIR.subtract({ months: 1 })

const notifiableProfiles = await supabaseAdmin.from('profiles')
  .select('id')
  // exclude those who have been notified in the last month
  .or(`certificate_last_reminder.is.null,certificate_last_reminder.lt.${oneMonthAgo}`)
  // exclude those who hold a valid certificate
  .not('id', 'in', `(${usersByCertificateStatus.valid.join(',')})`)
if (notifiableProfiles.error) throw notifiableProfiles.error

console.info(notifiableProfiles.data.length + ' users need to be notified')

if (notifiableProfiles.data.length < 1) {
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
  .update({ certificate_last_reminder: NIR.plainDate })
  .in('id', [...expiredSuccessfullyNotified, ...absentSuccessfullyNotified])
if(updateError) throw updateError

console.info(`Job "certificate-reminder" finished!`)
