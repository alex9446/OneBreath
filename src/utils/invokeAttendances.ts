import { FunctionsHttpError } from '@supabase/supabase-js'
import type { SupabaseClientDB } from './mixed.types'
import type { AttendancesExtra, ResponseBody } from './functions.types'

const invokeAttendances = async ( supabaseClient: SupabaseClientDB,
                                  action: 'verify' | 'set',
                                  groupId: number ): Promise<ResponseBody<AttendancesExtra>> => {
  const { data, error } = await supabaseClient.functions.invoke('attendances', {
    body: { 'action': action, 'group': groupId }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeAttendances
