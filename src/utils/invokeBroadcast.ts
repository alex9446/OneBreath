import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { ResponseBody } from '@shared/functions.types'
import invokeFunctions from './invokeFunctions'

const invokeBroadcast = async ( supabaseClient: SupabaseClientDB,
                                userIds: string[],
                                message: string ): Promise<ResponseBody<null>> => (
  invokeFunctions(supabaseClient, 'broadcast', { 'user_ids': userIds, 'message': message })
)

export default invokeBroadcast
