import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import { Database } from '../_shared/database.types.ts'
import { craftAddSheet, craftAttendancesRows, craftBoolValidation,
         craftDaysRow, craftRange } from './craftBatchUpdate.ts'

console.info(`Job "attendance-exporter" started!`)

class ExtendedMap<K, V> extends Map<K, V> {
  getNotNull(key: K): V {
    const v = this.get(key)
    if (v === undefined) throw 'key not found'
    return v
  }
}


const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

const serviceAccountInfo = JSON.parse(atob(Deno.env.get('SERVICE_ACCOUNT_INFO')!))
const spreadsheetId = Deno.env.get('SPREADSHEET_ID')!

const groups = await supabaseAdmin.from('groups').select('id,name')
if (groups.error) throw groups.error
const groupsById = new ExtendedMap(groups.data.map((group) => [group.id, group.name]))

const profiles = await supabaseAdmin.from('profiles').select('id,first_name,last_name')
if (profiles.error) throw profiles.error
const namesById = new ExtendedMap(
  profiles.data.map((profile) => [profile.id, `${profile.first_name} ${profile.last_name}`])
)

const lastMonth = Temporal.Now.plainDateISO().subtract({ months: 1 })
const lastMonthFirstDate = lastMonth.with({ day: 1 }).toString()
const lastMonthLastDate = lastMonth.with({ day: lastMonth.daysInMonth }).toString()

const attendances = await supabaseAdmin.from('attendances')
  .select('marked_day,user_id,group_id')
  .gte('marked_day', lastMonthFirstDate)
  .lte('marked_day', lastMonthLastDate)
if (attendances.error) throw attendances.error

const aData = attendances.data
const aHashMap = new Map(aData.map((a) => [`${a.user_id}_${a.marked_day}`, a]))
const days = Array.from(new Set(aData.map((a) => a.marked_day))).sort()
const userIds = Array.from(new Set(aData.map((a) => a.user_id)))

const necessaryColumns = days.length + 1
const necessaryRows = userIds.length + 1

const attendanceRows = userIds.map((userId) => {
  const row = days.map((day) => {
    const entry = aHashMap.get(`${userId}_${day}`)
    return entry ? groupsById.getNotNull(entry.group_id) : null
  })
  return { name: namesById.getNotNull(userId), attendances_group: row }
}).toSorted((a, b) => a.name.localeCompare(b.name))

const auth = new google.auth.JWT({
  email: serviceAccountInfo.client_email,
  key: serviceAccountInfo.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const service = google.sheets({ version: 'v4', auth })

const sheetTitle = `${lastMonth.year}-${lastMonth.month}`
const sheetId = lastMonth.year * 100 + lastMonth.month

const response = await service.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: { requests: [ craftAddSheet(sheetTitle, sheetId) ] }
})
if (!response.ok) Deno.exit(1)

service.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [
      craftBoolValidation(craftRange(sheetId, 1, necessaryRows, 1, necessaryColumns)),
      {
        updateCells: {
          range: craftRange(sheetId, 0, necessaryRows, 0, necessaryColumns),
          fields: 'userEnteredValue,note',
          rows: [craftDaysRow('Soci', days), ...craftAttendancesRows(attendanceRows)]
        }
      }
    ]
  }
})

console.info(`Job "attendance-exporter" finished!`)
