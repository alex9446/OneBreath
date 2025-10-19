import Cookies from 'js-cookie'
import { useSupabase } from './context'

type Group = {
  id: number
  name: string
}
type Groups = Group[]

export const setGroups = (groups: Groups) => {
  Cookies.set('groups_cache', JSON.stringify(groups), { expires: 1 })
}

export const getGroups = (): Groups => JSON.parse(Cookies.get('groups_cache') ?? '[]')

export const fetchGroups = async () => {
  const cached_groups = getGroups()
  if (cached_groups.length > 0) return cached_groups

  const supabaseClient = useSupabase()!
  const { data: groups, error } = await supabaseClient.from('groups').select('id,name').order('id')
  if (error) throw error.message
  setGroups(groups)
  return groups
}

export const fetchGroup = async (id: number) => {
  return (await fetchGroups()).find((group) => group.id == id)
}
