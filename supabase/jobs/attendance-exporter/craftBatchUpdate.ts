const craftBoolValue = (bool: boolean, groupName?: string) => (
  { userEnteredValue: { boolValue: bool }, note: groupName }
)

const craftStringValue = (str: string) => (
  { userEnteredValue: { stringValue: str } }
)

export const craftDaysRows = (days: string[]) => (
  {
    values: ['Nome', ...days].map((day) => craftStringValue(day))
  }
)

type Rows = {
  name: string;
  attendances_group: (string | null)[];
}[]
export const craftAttendancesRows = (rows: Rows) => (
  rows.map((row) => (
    {
      values: [
        craftStringValue(row.name),
        ...row.attendances_group.map((group) => (
          group ? craftBoolValue(true, group) : craftBoolValue(false)
        ))
      ]
    }
  ))
)
