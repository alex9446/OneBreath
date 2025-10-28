import { FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import type { LeaderboardExtra, ResponseBody } from './functions.types'

const invokeLeaderboard = async ( supabaseClient: SupabaseClient<Database>,
                                  groupId: number ): Promise<ResponseBody<LeaderboardExtra>> => {
  const { data, error } = await supabaseClient.functions.invoke('leaderboard', {
    body: { 'group': groupId }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeLeaderboard
