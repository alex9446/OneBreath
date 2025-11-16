import type { SupabaseClientDB } from './shortcut.types'
import { setAdminInLS, setGroupInLS } from './mixed'

export const getUserId = async (supabaseClient: SupabaseClientDB) => {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  if (error) throw error.message
  if (!session) throw 'session is null'
  return session.user.id
}

export const fillLocalStorage = async (supabaseClient: SupabaseClientDB, userId: string) => {
  const { data: profile, error: profileError } = await supabaseClient.from('profiles')
    .select('group_id').eq('id', userId).single()
  if (profileError) throw profileError.message
  setGroupInLS(profile.group_id)

  const { data: admin, error: adminError } = await supabaseClient.from('admins')
    .select('level').eq('id', userId).maybeSingle()
  if (adminError) throw adminError.message
  setAdminInLS(admin ? admin.level : 0)
}
