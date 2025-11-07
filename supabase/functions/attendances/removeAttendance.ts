import { SupabaseClientDB } from '../_shared/shortcut.types.ts'
import { FunctionReturn } from '../_shared/mixed.types.ts'


export async function removeAttendance(supabaseAdmin: SupabaseClientDB,
                                       dayToRemovePlainDate: string,
                                       userId: string): FunctionReturn<null> {
  const { error } = await supabaseAdmin
    .from('attendances')
    .delete()
    .eq('marked_day', dayToRemovePlainDate)
    .eq('user_id', userId)
  if (error) return { data: null, error: { message: error.message, code: 500 } }
  return { data: null, error: null }
}
