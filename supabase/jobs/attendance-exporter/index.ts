import { createClient } from '@supabase/supabase-js'
import { Database } from '../_shared/database.types.ts'
import { google } from 'googleapis'
import { craftAttendancesRows, craftDaysRows } from "./craftBatchUpdate.ts";

console.info(`Job "attendance-exporter" started!`)

const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

const serviceAccountInfo = JSON.parse(atob(Deno.env.get('SERVICE_ACCOUNT_INFO')!))
const spreadsheetId = Deno.env.get('SPREADSHEET_ID')!

const groups = await supabaseAdmin.from('groups').select('id,name')
if (groups.error) throw groups.error
const groupsById = new Map(groups.data.map((group) => [group.id, group.name]))

const lastMonth = Temporal.Now.plainDateISO().subtract({ months: 1 })
const lastMonthFirstDate = lastMonth.with({ day: 1 }).toString()
const lastMonthLastDate = lastMonth.with({ day: lastMonth.daysInMonth }).toString()

const attendances = await supabaseAdmin.from('attendances_with_name')
  .select('marked_day,group_id,user_id,name')
  .gte('marked_day', lastMonthFirstDate)
  .lte('marked_day', lastMonthLastDate)
if (attendances.error) throw attendances.error

const aData = attendances.data
const aHashMap = new Map(aData.map((a) => [`${a.user_id}_${a.marked_day}`, a]))
const namesById = new Map(aData.map((a) => [a.user_id, a.name]))
const days = Array.from(new Set(aData.map((a) => a.marked_day!))).sort()
const userIds = Array.from(new Set(aData.map((a) => a.user_id)))

const attendanceRows = userIds.map((userId) => {
  const row = days.map((day) => {
    const entry = aHashMap.get(`${userId}_${day}`)
    return entry ? groupsById.get(entry.group_id!)! : null
  })
  return { name: namesById.get(userId)!, attendances_group: row }
}).toSorted((a, b) => a.name.localeCompare(b.name))

const auth = new google.auth.JWT({
  email: serviceAccountInfo.client_email,
  key: serviceAccountInfo.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const service = google.sheets({ version: 'v4', auth })

service.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [
      {
        setDataValidation: {
          range: {
            sheetId: 0,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: 1,
            endColumnIndex: 1000
          },
          rule: {
            showCustomUi: true,
            strict: true,
            condition: {
              type: 'BOOLEAN'
            }
          }
        }
      },
      {
        updateCells: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1000,
            startColumnIndex: 0,
            endColumnIndex: 1000
          },
          fields: 'userEnteredValue,note',
          rows: [craftDaysRows(days), ...craftAttendancesRows(attendanceRows)]
        }
      }
    ]
  }
})
