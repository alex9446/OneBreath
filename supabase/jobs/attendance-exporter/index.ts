import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import { Database } from '../_shared/database.types.ts'
import {
  craftAddSheet, craftAlert, craftBoolValidation, craftDeleteSheet, craftHeaderRow, craftRange,
  craftResizeFirstThreeColumns, craftUpdateCells, craftUserRows
} from './craftBatchUpdate.ts'

enum Sheet {
  ZeroIndex = 0,
  HeaderRow = 1,
  StaticCells = 3,
  ColumnSize = 180
}

console.info(`Job "attendance-exporter" started!`)

const today = Temporal.Now.plainDateISO('Europe/Rome')
const yesterday = today.subtract({ days: 1 })
const monthLocaleString = yesterday.toLocaleString('it-IT', { month: 'long' })
const monthFirstDate = yesterday.with({ day: 1 }).toString()

const expirationState = (date: string) => {
  const expiration = Temporal.PlainDate.from(date)
  const expirationLocaleIT = expiration.toLocaleString('it-IT')
  if (Temporal.PlainDate.compare(expiration, today) >= 0) {
    return `valido, fino al ${expirationLocaleIT}`
  }
  return `scaduto, il ${expirationLocaleIT}`
}

const defineOrThrow = <T>(value: T) => {
  if (value === undefined) throw new Error('value is undefined')
  return value
}


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

const serviceAccountInfo = JSON.parse(atob(Deno.env.get('SERVICE_ACCOUNT_INFO')!))

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
  [certificate.user_id, expirationState(certificate.expiration)]
)))
const paymentByUserId = new Map(payments.data.map((payment) => (
  [payment.user_id, expirationState(payment.expiration)]
)))

const unique = <T>(array: T[]) => Array.from(new Set(array))
const markedGroups = unique(attendances.data.map((a) => a.group_id)).sort()

const sheets = markedGroups.map((group) => {
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
    days,
    userRows: userIds.map((userId) => ({
      name: defineOrThrow(namesById.get(userId)),
      certificate: certificateByUserId.get(userId) ?? 'no',
      payment: paymentByUserId.get(userId) ?? 'no',
      attendant: days.map((day) => attendancesHash.includes(`${day}_${userId}`))
    })).toSorted((a, b) => a.name.localeCompare(b.name))
  }
})

const auth = new google.auth.JWT({
  email: serviceAccountInfo.client_email,
  key: serviceAccountInfo.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const service = google.sheets({ version: 'v4', auth })

for (const sheet of sheets) {
  if (!sheet) continue
  const spreadsheetId = sheet.spreadsheetId

  try {
    await service.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [ craftDeleteSheet(sheet.sheetId) ]
      }
    })
  } catch (err: unknown) {
    if (!(
      typeof err === 'object' && err !== null &&
      'message' in err && typeof err.message === 'string' &&
      err.message.includes(`No sheet with id: ${sheet.sheetId}`)
    )) throw err
  }

  service.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        craftAddSheet(sheet.sheetTitle, sheet.sheetId),
        craftBoolValidation(craftRange(
          sheet.sheetId,
          Sheet.HeaderRow, sheet.necessaryRows,
          Sheet.StaticCells, sheet.necessaryColumns
        )),
        craftUpdateCells(
          craftRange(
            sheet.sheetId,
            Sheet.ZeroIndex, sheet.necessaryRows,
            Sheet.ZeroIndex, sheet.necessaryColumns
          ),
          [
            craftHeaderRow(['Soci', 'Certificato', 'Pagamento'], sheet.days),
            ...craftUserRows(sheet.userRows)
          ]
        ),
        craftResizeFirstThreeColumns(sheet.sheetId, Sheet.ColumnSize),
        craftAlert(
          sheet.sheetId, sheet.necessaryRows, 'ATTENZIONE: non modificare, verrà sovrascritto!'
        )
      ]
    }
  })
}

console.info(`Job "attendance-exporter" finished!`)
