import { createClient } from '@supabase/supabase-js'
import { getDenoEnv, sendHeartbeat } from '@shared/mixed.deno.ts'
import { Database } from '@shared/database.types.ts'
import { runBatchUpdate, Sheet } from './runBatchUpdate.ts'

console.info(`Job "attendance-certificate-exporter" started!`)
await sendHeartbeat(true)

const today = Temporal.Now.plainDateISO('Europe/Rome')
const yesterday = today.subtract({ days: 1 })
const monthLocaleString = yesterday.toLocaleString('it-IT', { month: 'long' })
const monthFirstDate = yesterday.with({ day: 1 }).toString()

const expirationState = (date: string) => {
  const expiration = Temporal.PlainDate.from(date)
  return {
    isValid: Temporal.PlainDate.compare(expiration, today) >= 0,
    expirationPlainDate: expiration,
    expirationLocaleIT: expiration.toLocaleString('it-IT')
  }
}

const expirationStateStr = (date: string) => {
  const state = expirationState(date)
  return `${state.isValid ? 'valido, fino al' : 'scaduto, il'} ${state.expirationLocaleIT}`
}

const defineOrThrow = <T>(value: T) => {
  if (value === undefined) throw new Error('value is undefined')
  return value
}

const athletesUrl = getDenoEnv('ATHLETES_URL')

const supabaseAdmin = createClient<Database>(
  getDenoEnv('SUPABASE_URL'),
  getDenoEnv('SECRET_JOBS_KEY')
)

const groupsProm = supabaseAdmin.from('groups').select('id,spreadsheet_id')
const profilesProm = supabaseAdmin.from('profiles').select('id,first_name,last_name')
const certificatesProm = supabaseAdmin.from('certificates').select('user_id,expiration')
const paymentsProm = supabaseAdmin.from('payments').select('user_id,expiration')
const attendancesProm = supabaseAdmin.from('attendances')
  .select('marked_day,user_id,group_id')
  .gte('marked_day', monthFirstDate)
  .lte('marked_day', yesterday.toString())

const [groups, profiles, certificates, payments, attendances] = await Promise.all(
  [groupsProm, profilesProm, certificatesProm, paymentsProm, attendancesProm]
)

if (groups.error) throw groups.error
if (profiles.error) throw profiles.error
if (certificates.error) throw certificates.error
if (payments.error) throw payments.error
if (attendances.error) throw attendances.error

const spreadsheetByGroupId = new Map(groups.data.map((group) => (
  [group.id, group.spreadsheet_id]
)))
const namesById = new Map(profiles.data.map((profile) => (
  [profile.id, `${profile.first_name} ${profile.last_name}`]
)))
const certificateByUserId = new Map(certificates.data.map((certificate) => (
  [certificate.user_id, expirationStateStr(certificate.expiration)]
)))
const paymentByUserId = new Map(payments.data.map((payment) => (
  [payment.user_id, expirationStateStr(payment.expiration)]
)))

const unique = <T>(array: T[]) => Array.from(new Set(array))
const markedGroups = unique(attendances.data.map((a) => a.group_id)).sort()

const attendanceSheets = markedGroups.map((group) => {
  const groupAttendances = attendances.data.filter((a) => a.group_id === group)
  const days = unique(groupAttendances.map((a) => a.marked_day)).sort()
  const userIds = unique(groupAttendances.map((a) => a.user_id))
  const attendancesHash = groupAttendances.map((a) => `${a.marked_day}_${a.user_id}`)
  const spreadsheetId = spreadsheetByGroupId.get(group)

  if (!spreadsheetId) {
    console.error(`Missing spreadsheet_id for group ${group}` )
    return null
  }

  return {
    spreadsheetId,
    sheetTitle: `${monthLocaleString} ${yesterday.year}`,
    sheetId: yesterday.year * 100 + yesterday.month,
    necessaryColumns: Sheet.StaticCells + days.length,
    necessaryRows: Sheet.HeaderRow + userIds.length,
    days: days.map((day) => Temporal.PlainDate.from(day).toLocaleString('it-IT')),
    userRows: userIds.map((userId) => ({
      name: defineOrThrow(namesById.get(userId)),
      link: athletesUrl + userId,
      certificate: certificateByUserId.get(userId) ?? 'no',
      payment: paymentByUserId.get(userId) ?? 'no',
      attendant: days.map((day) => attendancesHash.includes(`${day}_${userId}`))
    })).toSorted((a, b) => a.name.localeCompare(b.name))
  }
})
export type AttendanceSheets = typeof attendanceSheets

const certificateRows = certificates.data.map((certificate) => {
  const state = expirationState(certificate.expiration)
  return {
    name: defineOrThrow(namesById.get(certificate.user_id)),
    state: state.isValid ? 'valido' : 'scaduto',
    expiration: state.expirationPlainDate
  }
}).toSorted((a, b) => a.name.localeCompare(b.name))
export type CertificateRows = typeof certificateRows

await runBatchUpdate(attendanceSheets, certificateRows)

await sendHeartbeat()
console.info(`Job "attendance-certificate-exporter" finished!`)
