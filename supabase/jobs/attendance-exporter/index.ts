import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import { Database } from '../_shared/database.types.ts'
import {
  craftAddSheet, craftAlert, craftBoolValidation, craftDaysRow, craftDeleteSheet, craftRange,
  craftResizeColumns, craftUpdateCells, craftUserRows
} from './craftBatchUpdate.ts'

console.info(`Job "attendance-exporter" started!`)

const defineOrThrow = <T>(value: T) => {
  if (value === undefined) throw new Error('value is undefined')
  return value
}


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

const serviceAccountInfo = JSON.parse(atob(Deno.env.get('SERVICE_ACCOUNT_INFO')!))

const groups = await supabaseAdmin.from('groups').select('id,spreadsheet_id')
if (groups.error) throw groups.error
const spreadsheetByGroupId = new Map(
  groups.data.map((group) => [group.id, group.spreadsheet_id])
)

const profiles = await supabaseAdmin.from('profiles').select('id,first_name,last_name')
if (profiles.error) throw profiles.error
const namesById = new Map(
  profiles.data.map((profile) => [profile.id, `${profile.first_name} ${profile.last_name}`])
)

const yesterday = Temporal.Now.plainDateISO('Europe/Rome').subtract({ days: 1 })
const monthLocaleString = yesterday.toLocaleString('it-IT', { month: 'long' })
const monthFirstDate = yesterday.with({ day: 1 }).toString()

const attendances = await supabaseAdmin.from('attendances')
  .select('marked_day,user_id,group_id')
  .gte('marked_day', monthFirstDate)
  .lte('marked_day', yesterday.toString())
if (attendances.error) throw attendances.error

const aData = attendances.data

const unique = <T>(array: T[]) => Array.from(new Set(array))
const markedGroups = unique(aData.map((a) => a.group_id)).sort()

const sheets = markedGroups.map((group) => {
  const groupAttendances = aData.filter((a) => a.group_id === group)
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
    necessaryColumns: days.length + 1,
    necessaryRows: userIds.length + 1,
    days,
    userRows: userIds.map((userId) => {
      const attendant = days.map((day) => attendancesHash.includes(`${day}_${userId}`))
      return { name: defineOrThrow(namesById.get(userId)), attendant }
    }).toSorted((a, b) => a.name.localeCompare(b.name))
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
          sheet.sheetId, 1, sheet.necessaryRows, 1, sheet.necessaryColumns
        )),
        craftUpdateCells(
          craftRange(sheet.sheetId, 0, sheet.necessaryRows + 2, 0, sheet.necessaryColumns),
          [
            craftDaysRow('Soci', sheet.days),
            ...craftUserRows(sheet.userRows)
          ]
        ),
        craftResizeColumns(sheet.sheetId, 0, 1, 200),
        craftUpdateCells(
          craftRange(sheet.sheetId, sheet.necessaryRows + 1, sheet.necessaryRows + 2, 0, 1),
          [ craftAlert('ATTENZIONE: non modificare, verrà sovrascritto!') ]
        )
      ]
    }
  })
}

console.info(`Job "attendance-exporter" finished!`)
