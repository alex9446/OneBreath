import { FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type InvokeResponse = {
  message?: string,
  code: number,
  extra: {
    day_of_week?: number,
    group_setted?: number,
    day_setted?: number
  }
}

const invokeAttendances = async ( supabaseClient: SupabaseClient<Database>,
                                  action: 'verify' | 'set',
                                  groupId: number ): Promise<InvokeResponse> => {
  const { data, error } = await supabaseClient.functions.invoke('attendances', {
    body: { 'action': action, 'group': groupId }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeAttendances
