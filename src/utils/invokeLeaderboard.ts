import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { LeaderboardExtra, ResponseBody } from '@shared/functions.types'
import invokeFunctions from './invokeFunctions'

const invokeLeaderboard = async ( supabaseClient: SupabaseClientDB,
                                  groupId: number ): Promise<ResponseBody<LeaderboardExtra>> => (
  invokeFunctions(supabaseClient, 'leaderboard', { 'group': groupId })
)

export default invokeLeaderboard
