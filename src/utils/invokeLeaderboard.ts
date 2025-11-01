import { FunctionsHttpError } from '@supabase/supabase-js'
import type { LeaderboardExtra, ResponseBody } from './functions.types'
import { useSupabase } from './context'

const invokeLeaderboard = async ( groupId: number ): Promise<ResponseBody<LeaderboardExtra>> => {
  const supabaseClient = useSupabase()
  const { data, error } = await supabaseClient.functions.invoke('leaderboard', {
    body: { 'group': groupId }
  })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeLeaderboard
