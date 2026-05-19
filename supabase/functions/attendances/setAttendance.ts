import { SupabaseClientDB } from '@shared/shortcut.types.ts'
import { FunctionReturn } from '@shared/functions.types.ts'


export async function setAttendance(supabaseAdmin: SupabaseClientDB,
                                    group: number,
                                    dayToMarkPlainDate: string,
                                    userId: string): FunctionReturn<null> {
  const { error } = await supabaseAdmin.from('attendances').insert([
    { marked_day: dayToMarkPlainDate, user_id: userId, group_id: group }
  ])
  if (error) return { data: null, error: { message: error.message, code: 500 } }
  return { data: null, error: null }
}
