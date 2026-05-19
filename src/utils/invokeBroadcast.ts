import { FunctionsHttpError } from '@supabase/supabase-js'
import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { ResponseBody } from '@shared/functions.types'

const invokeBroadcast = async ( supabaseClient: SupabaseClientDB,
                                userIds: string[],
                                message: string ): Promise<ResponseBody<null>> => {
  const { data, error } = await supabaseClient.functions.invoke('broadcast', {
    body: { 'user_ids': userIds, 'message': message }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeBroadcast
