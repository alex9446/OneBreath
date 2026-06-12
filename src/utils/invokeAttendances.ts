import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { AttendancesExtra, ResponseBody } from '@shared/functions.types'
import invokeFunctions from './invokeFunctions'

const invokeAttendances = async ( supabaseClient: SupabaseClientDB,
                                  action: 'remove' | 'verify' | 'set',
                                  groupId: number ): Promise<ResponseBody<AttendancesExtra>> => (
  invokeFunctions(supabaseClient, 'attendances', { 'action': action, 'group': groupId })
)

export default invokeAttendances
