import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Database } from '../_shared/database.types.ts'

const validTimes = {
  start: 20,
  end: 24
}


export async function allowedAttendance(supabaseAdmin: SupabaseClient<Database>,
                                        group: number,
                                        nowInRome: Temporal.ZonedDateTime,
                                        userId: string) {

  const { data: attendances, error: attendancesError } = await supabaseAdmin
    .from('attendances')
    .select('marked_day,user_id,group_id')
    .eq('marked_day', nowInRome.toPlainDate().toString())
    .eq('user_id', userId)
  if (attendancesError) return { message: attendancesError.message, code: 500 }
  if (attendances.length > 0) return {
    message: 'attendance already set!',
    groupSetted: attendances[0].group_id,
    daySetted: nowInRome.dayOfWeek,
    code: 403
  }

  const { data: groups, error: groupsError } = await supabaseAdmin
    .from('groups')
    .select('id,days_of_week')
    .eq('id', group)
  if (groupsError) return { message: groupsError.message, code: 500 }
  if (groups.length !== 1) return { message: 'non-existent group!', code: 400 }
  const allowedDay = groups[0].days_of_week.includes(nowInRome.dayOfWeek)
  const allowedTime = nowInRome.hour >= validTimes.start && nowInRome.hour < validTimes.end
  if (!allowedDay || !allowedTime) return { message: 'day or time not allowed!', code: 403 }

  return { message: 'ok', code: 200 }
}
