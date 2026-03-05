import { SupabaseClientDB } from '../_shared/shortcut.types.ts'
import { AttendancesExtra, FunctionReturn } from '../_shared/mixed.types.ts'

const startTime = 16


const errorMessage = (message: string, code: number) => ({ data: null, error: { message, code } })

export async function allowedAttendance(supabaseAdmin: SupabaseClientDB,
                                        group: number,
                                        userId: string): FunctionReturn<AttendancesExtra> {
  const nowInRome = Temporal.Now.zonedDateTimeISO('Europe/Rome')
  const dayToMark = nowInRome.hour < startTime ? nowInRome.subtract({ days: 1 }) : nowInRome
  const dayToMarkPlainDate = dayToMark.toPlainDate().toString()

  const { data: attendanceRow, error: attendanceError } = await supabaseAdmin
    .from('attendances').select('group_id')
    .eq('marked_day', dayToMarkPlainDate).eq('user_id', userId).maybeSingle()
  if (attendanceError) return errorMessage(attendanceError.message, 500)
  if (attendanceRow) return {
    data: {
      state: 'already-set',
      alreadySet: true,  // deprecated, maintained for front-end compatibility
      groupSetted: attendanceRow.group_id,
      daySetted: dayToMark.dayOfWeek,
      daySettedPlainDate: dayToMarkPlainDate
    },
    error: null
  }

  const groupProm = supabaseAdmin
    .from('groups').select('days_of_week').eq('id', group).single()
  const midweekHolidayProm = supabaseAdmin
    .from('midweek_holidays').select('date').eq('date', dayToMarkPlainDate).maybeSingle()

  const [{ data: groupRow, error: groupErr }, { data: holidayRow, error: holidayErr }] = (
    await Promise.all([groupProm, midweekHolidayProm])
  )

  if (groupErr) return errorMessage(groupErr.message, 500)
  if (holidayErr) return errorMessage(holidayErr.message, 500)

  const allowedDays = groupRow.days_of_week
  const isDayNotAllowed = !allowedDays.includes(dayToMark.dayOfWeek)
  const isMidweekHoliday = !!holidayRow

  if (isDayNotAllowed || isMidweekHoliday) return {
    data: {
      state: isDayNotAllowed ? 'day-not-allowed' : 'midweek-holiday',
      alreadySet: false,  // deprecated, maintained for front-end compatibility
      DayNotAllowed: true,  // deprecated, maintained for front-end compatibility
      allowedDays,
      startTime,
      openingTime: 24
    },
    error: null
  }

  return {
    data: {
      state: 'settable',
      alreadySet: false,  // deprecated, maintained for front-end compatibility
      DayNotAllowed: false,  // deprecated, maintained for front-end compatibility
      dayOfWeek: dayToMark.dayOfWeek,
      dayToMarkPlainDate
    },
    error: null
  }
}
