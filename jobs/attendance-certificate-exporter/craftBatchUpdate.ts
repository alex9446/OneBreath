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
        sheetId,
        gridProperties: {
          frozenRowCount: 1,
          frozenColumnCount: 1
        }
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
      fields: 'userEnteredValue,userEnteredFormat,textFormatRuns',
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

const craftBold = (disable?: boolean) => (
  { userEnteredFormat: { textFormat: { bold: !disable } } }
)

const craftLink = (uri: string) => (
  { textFormatRuns: [
    { format: { link: { uri } } }
  ]}
)

const craftDateValue = (date: Temporal.PlainDate) => {
  const sheetsEpoch = Temporal.PlainDate.from({ year: 1899, month: 12, day: 30 })
  const serialNumber = date.since(sheetsEpoch, { largestUnit: 'days' }).days
  return {
    userEnteredValue: { numberValue: serialNumber },
    userEnteredFormat: {
      numberFormat: { type: 'DATE', pattern: 'dd/mm/yyyy' },
      horizontalAlignment: 'LEFT'
    }
  }
}

const craftValues = (values: sheets_v4.Schema$CellData[]) => ({ values })

export const craftHeaderRow = (firstStaticCells: string[], days: string[]) => (
  craftValues([...firstStaticCells, ...days].map((value) => (
    { ...craftStringValue(value), ...craftBold() }
  )))
)

type UserRows = {
  name: string
  link: string
  certificate: string
  payment: string
  attendant: boolean[]
}[]
export const craftUserRows = (rows: UserRows) => (
  rows.map((row) => craftValues([
    { ...craftStringValue(row.name), ...craftLink(row.link) },
    craftStringValue(row.certificate),
    craftStringValue(row.payment),
    ...row.attendant.map((b) => craftBoolValue(b))
  ]))
)

type CertificateRows = {
  name: string
  state: string
  expiration: Temporal.PlainDate
}[]
export const craftCertificateRows = (rows: CertificateRows) => (
  rows.map((row) => craftValues([
    craftStringValue(row.name),
    craftStringValue(row.state),
    craftDateValue(row.expiration)
  ]))
)

export const craftAlert = (sheetId: number, skipRows: number, message: string) => (
  craftUpdateCells(
    craftRange(sheetId, skipRows+1, skipRows+2, 1, 2),  // +1 +2 for one row
    [ craftValues([{ ...craftStringValue(message), ...craftBold() }]) ]
  )
)
