import type { sheets_v4 } from 'googleapis'

const craftBoolValue = (bool: boolean, groupName?: string) => (
  { userEnteredValue: { boolValue: bool }, note: groupName }
)

const craftStringValue = (str: string) => (
  { userEnteredValue: { stringValue: str } }
)

const craftValues = (values: sheets_v4.Schema$CellData[]) => ({ values })

export const craftDaysRow = (firstCell: string, days: string[]) => (
  craftValues([firstCell, ...days].map((day) => craftStringValue(day)))
)

export const craftRange = (sheetId: number, startRowIndex: number, endRowIndex: number,
                           startColumnIndex: number, endColumnIndex: number) => (
  { sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }
)

type Rows = {
  name: string;
  attendances_group: (string | null)[];
}[]
export const craftAttendancesRows = (rows: Rows) => (
  rows.map((row) => craftValues([
    craftStringValue(row.name),
    ...row.attendances_group.map((group) => (
      group ? craftBoolValue(true, group) : craftBoolValue(false)
    ))
  ]))
)

export const craftBoolValidation = (range: sheets_v4.Schema$GridRange) => (
  {
    setDataValidation: {
      range,
      rule: {
        showCustomUi: true,
        strict: true,
        condition: {
          type: 'BOOLEAN'
        }
      }
    }
  }
)

export const craftAddSheet = (title: string, sheetId: number) => (
  {
    addSheet: {
      properties: {
        title,
        sheetId
      }
    }
  }
)
