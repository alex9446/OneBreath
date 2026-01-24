import { createClient } from '@supabase/supabase-js'
import { Database } from '../_shared/database.types.ts'
import { google } from 'googleapis'

console.info(`Job "attendance-exporter" started!`)

const supabaseAdmin = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SECRET_FUNCTIONS_KEY')!
)

const serviceAccountInfo = JSON.parse(atob(Deno.env.get('SERVICE_ACCOUNT_INFO')!))
const spreadsheetId = Deno.env.get('SPREADSHEET_ID')!

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
            startRowIndex: 0,
            endRowIndex: 10,
            startColumnIndex: 0,
            endColumnIndex: 5
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
            startRowIndex: 1,
            endRowIndex: 2,
            startColumnIndex: 1,
            endColumnIndex: 2
          },
          fields: 'userEnteredValue,note',
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    boolValue: true
                  },
                  note: 'nota di prova'
                }
              ]
            }
          ]
        }
      }
    ]
  }
})
