import { SupabaseClientDB } from '../_shared/shortcut.types.ts'
import { AttendancesExtra, FunctionReturn } from '../_shared/mixed.types.ts'

const validTimes = {
  start: 20,
  end: 12  // of next day
}


const errorMessage = (message: string, code: number) => ({ data: null, error: { message, code } })

export async function allowedAttendance(supabaseAdmin: SupabaseClientDB,
                                        group: number,
                                        userId: string): FunctionReturn<AttendancesExtra> {
  const nowInRome = Temporal.Now.zonedDateTimeISO('Europe/Rome')
  const dayToMark = nowInRome.hour < validTimes.end ? nowInRome.subtract({ days: 1 }) : nowInRome
  const dayToMarkPlainDate = dayToMark.toPlainDate().toString()

  const { data: attendanceRow, error: attendanceError } = await supabaseAdmin
    .from('attendances').select('marked_day,user_id,group_id')
    .eq('marked_day', dayToMarkPlainDate).eq('user_id', userId).maybeSingle()
  if (attendanceError) return errorMessage(attendanceError.message, 500)
  if (attendanceRow) return {
    data: {
      alreadySet: true,
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
  const nowIsAllowedTime = dayToMark.hour >= validTimes.start || dayToMark.hour < validTimes.end
  if (!todayIsAllowedDay || !nowIsAllowedTime) return {
    data: {
      alreadySet: false,
      DTnotAllowed: true,
      allowedDays,
      startTime: validTimes.start
    },
    error: null
  }

  return {
    data: {
      alreadySet: false,
      DTnotAllowed: false,
      dayOfWeek: dayToMark.dayOfWeek,
      dayToMarkPlainDate
    },
    error: null
  }
}
