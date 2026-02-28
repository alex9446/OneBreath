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
    .from('attendances').select('marked_day,user_id,group_id')
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

  const { data: groupRow, error: groupError } = await supabaseAdmin
    .from('groups').select('id,days_of_week').eq('id', group).single()
  if (groupError) return errorMessage(groupError.message, 500)
  const allowedDays = groupRow.days_of_week
  const todayIsAllowedDay = allowedDays.includes(dayToMark.dayOfWeek)
  if (!todayIsAllowedDay) return {
    data: {
      state: 'day-not-allowed',
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
