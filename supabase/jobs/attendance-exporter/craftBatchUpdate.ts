import type { sheets_v4 } from 'googleapis'

export const craftDeleteSheet = (sheetId: number) => (
  {
    deleteSheet: {
      sheetId
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

export const craftUpdateCells = (range: sheets_v4.Schema$GridRange,
                                 rows: sheets_v4.Schema$RowData[]) => (
  {
    updateCells: {
      range,
      fields: 'userEnteredValue',
      rows
    }
  }
)

const craftResizeColumns = (sheetId: number, startIndex: number, endIndex: number,
                                   pixelSize: number) => (
  {
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: 'COLUMNS',
        startIndex,
        endIndex
      },
      properties: { pixelSize },
      fields: 'pixelSize'
    }
  }
)

export const craftResizeFirstThreeColumns = (sheetId: number, pixelSize: number) => (
  craftResizeColumns(sheetId, 0, 3, pixelSize)
)

export const craftRange = (sheetId: number, startRowIndex: number, endRowIndex: number,
                           startColumnIndex: number, endColumnIndex: number) => (
  { sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }
)

const craftBoolValue = (bool: boolean) => (
  { userEnteredValue: { boolValue: bool } }
)

const craftStringValue = (str: string) => (
  { userEnteredValue: { stringValue: str } }
)

const craftValues = (values: sheets_v4.Schema$CellData[]) => ({ values })

export const craftHeaderRow = (firstStaticCells: string[], days: string[]) => (
  craftValues([...firstStaticCells, ...days].map((value) => craftStringValue(value)))
)

type Rows = {
  name: string
  certificate: string
  payment: string
  attendant: boolean[]
}[]
export const craftUserRows = (rows: Rows) => (
  rows.map((row) => craftValues([
    craftStringValue(row.name),
    craftStringValue(row.certificate),
    craftStringValue(row.payment),
    ...row.attendant.map((b) => craftBoolValue(b))
  ]))
)

export const craftAlert = (sheetId: number, skipRows: number, message: string) => (
  craftUpdateCells(
    craftRange(sheetId, skipRows+1, skipRows+2, 0, 1),  // +1 +2 for one row
    [ craftValues([craftStringValue(message)]) ]
  )
)
