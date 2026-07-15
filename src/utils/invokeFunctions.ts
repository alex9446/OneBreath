import { FunctionsHttpError, type FunctionInvokeOptions } from '@supabase/supabase-js'
import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { AttendancesExtra, LeaderboardExtra, ResponseBody } from '@shared/functions.types'

const invokeFunctions = async ( supabaseClient: SupabaseClientDB,
                                functionName: string,
                                body: NonNullable<FunctionInvokeOptions['body']> ) => {
  const { data, error } = await supabaseClient.functions.invoke(functionName, { body })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

const invokeAttendances = ( supabaseClient: SupabaseClientDB,
                            action: 'remove' | 'verify' | 'set',
                            groupId: number ): Promise<ResponseBody<AttendancesExtra>> => (
  invokeFunctions(supabaseClient, 'attendances', { 'action': action, 'group': groupId })
)

const invokeBroadcast = ( supabaseClient: SupabaseClientDB,
                          userIds: string[],
                          message: string ): Promise<ResponseBody<null>> => (
  invokeFunctions(supabaseClient, 'broadcast', { 'user_ids': userIds, 'message': message })
)

const invokeLeaderboard = ( supabaseClient: SupabaseClientDB,
                            groupId: number,
                            season: number | undefined ): Promise<ResponseBody<LeaderboardExtra>> => (
  invokeFunctions(supabaseClient, 'leaderboard', { 'group': groupId, 'season': season })
)

export { invokeAttendances, invokeBroadcast, invokeLeaderboard }
