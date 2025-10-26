import { FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import type { ResponseBody } from './mixed.types'

const invokeAttendances = async ( supabaseClient: SupabaseClient<Database>,
                                  action: 'verify' | 'set',
                                  groupId: number ): Promise<ResponseBody> => {
  const { data, error } = await supabaseClient.functions.invoke('attendances', {
    body: { 'action': action, 'group': groupId }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeAttendances
