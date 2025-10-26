import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Database } from '../_shared/database.types.ts'
import { Extra, FunctionReturn } from '../_shared/mixed.types.ts'

const validTimes = {
  start: 20,
  end: 24
}


const errorMessage = (message: string, code: number) => ({ data: null, error: { message, code } })

export async function allowedAttendance(supabaseAdmin: SupabaseClient<Database>,
                                        group: number,
                                        nowInRome: Temporal.ZonedDateTime,
                                        userId: string): FunctionReturn<Extra> {

  const { data: attendances, error: attendancesError } = await supabaseAdmin
    .from('attendances')
    .select('marked_day,user_id,group_id')
    .eq('marked_day', nowInRome.toPlainDate().toString())
    .eq('user_id', userId)
  if (attendancesError) return errorMessage(attendancesError.message, 500)
  if (attendances.length > 0) return {
    data: {
      alreadySet: true,
      groupSetted: attendances[0].group_id,
      daySetted: nowInRome.dayOfWeek
    },
    error: null
  }

  const { data: groups, error: groupsError } = await supabaseAdmin
    .from('groups')
    .select('id,days_of_week')
    .eq('id', group)
  if (groupsError) return errorMessage(groupsError.message, 500)
  if (groups.length !== 1) return errorMessage('non-existent group!', 400)
  const allowedDays = groups[0].days_of_week
  const todayIsAllowedDay = allowedDays.includes(nowInRome.dayOfWeek)
  const nowIsAllowedTime = nowInRome.hour >= validTimes.start && nowInRome.hour < validTimes.end
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
      dayOfWeek: nowInRome.dayOfWeek
    },
    error: null
  }
}
