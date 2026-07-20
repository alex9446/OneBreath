import Cookies from 'js-cookie'
import type { SupabaseClientDB } from '@shared/shortcut.types'

type Group = {
  id: number
  name: string
  acronym: string
}
type Groups = Group[]

const setGroups = (groups: Groups) => {
  Cookies.set('groups_cache', JSON.stringify(groups), { expires: 4 })
}

const getGroups = (): Groups => JSON.parse(Cookies.get('groups_cache') ?? '[]')

export const fetchGroups = async (supabaseClient: SupabaseClientDB) => {
  const cachedGroups = getGroups()
  if (cachedGroups.length > 0) return cachedGroups

  const { data: groups, error } = await supabaseClient.from('groups')
    .select('id,name,acronym').order('id')
  if (error) throw error.message
  setGroups(groups)
  return groups
}

export const groupsById = async (supabaseClient: SupabaseClientDB) => {
  return (await fetchGroups(supabaseClient)).reduce((acc, group) => {
    acc[group.id] = group
    return acc
  }, {} as Record<number, Group>)
}
