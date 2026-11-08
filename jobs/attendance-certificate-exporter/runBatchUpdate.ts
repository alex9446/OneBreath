import { google } from 'googleapis'
import { getDenoEnv } from '@shared/mixed.deno.ts'
import {
  craftAddSheet, craftAlert, craftBoolValidation, craftCertificateRows, craftDeleteSheet,
  craftHeaderRow, craftRange, craftResizeFirstThreeColumns, craftUpdateCells, craftUserRows
} from './craftBatchUpdate.ts'
import type { AttendanceSheets, CertificateRows } from './index.ts'

export enum Sheet {
  ZeroIndex = 0,
  HeaderRow = 1,
  StaticCells = 3,
  ColumnSize = 180
}

export const runBatchUpdate = async (attendanceSheets: AttendanceSheets,
                                     certificateRows: CertificateRows) => {
  const serviceAccountInfo = JSON.parse(atob(getDenoEnv('SERVICE_ACCOUNT_INFO')))

  const auth = new google.auth.JWT({
    email: serviceAccountInfo.client_email,
    key: serviceAccountInfo.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const service = google.sheets({ version: 'v4', auth })

  const alertMessage = 'ATTENZIONE: non modificare, verrà sovrascritto!'

  for (const sheet of attendanceSheets) {
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

    await service.spreadsheets.batchUpdate({
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
          craftAlert(sheet.sheetId, sheet.necessaryRows, alertMessage)
        ]
      }
    })
  }

  const certificateSpreadsheetId = Deno.env.get('CERTIFICATE_SPREADSHEET_ID')
  if (!certificateSpreadsheetId) {
    console.warn('CERTIFICATE_SPREADSHEET_ID is undefined!', certificateSpreadsheetId)
    return
  }

  const endRowIndex = Sheet.HeaderRow + certificateRows.length

  await service.spreadsheets.batchUpdate({
    spreadsheetId: certificateSpreadsheetId,
    requestBody: {
      requests: [
        craftUpdateCells({ sheetId: 0 }, []),
        craftUpdateCells(
          craftRange(
            0,
            Sheet.ZeroIndex, endRowIndex,
            Sheet.ZeroIndex, 3),
          [
            craftHeaderRow(['Soci', 'Stato', 'Scadenza'], []),
            ...craftCertificateRows(certificateRows)
          ]
        ),
        craftResizeFirstThreeColumns(0, Sheet.ColumnSize),
        craftAlert(0, endRowIndex, alertMessage)
      ]
    }
  })
}
