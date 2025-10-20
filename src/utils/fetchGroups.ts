import Cookies from 'js-cookie'
import { useSupabase } from './context'

type Groups = {
  id: number
  name: string
}[]

export const setGroups = (groups: Groups) => {
  Cookies.set('groups_cache', JSON.stringify(groups), { expires: 1 })
}

export const getGroups = (): Groups => JSON.parse(Cookies.get('groups_cache') ?? '[]')

export const fetchGroups = async () => {
  const cachedGroups = getGroups()
  if (cachedGroups.length > 0) return cachedGroups

  const supabaseClient = useSupabase()
  const { data: groups, error } = await supabaseClient.from('groups').select('id,name').order('id')
  if (error) throw error.message
  setGroups(groups)
  return groups
}

export const fetchGroup = async (id: number) => {
  const group = (await fetchGroups()).find((group) => group.id == id)
  if (!group) throw 'Mismatch with group select'
  return group
}
