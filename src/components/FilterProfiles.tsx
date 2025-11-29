import { createResource, For, type Component, type Setter } from 'solid-js'
import type { Tables } from '../utils/database.types'
import { groupsById } from '../utils/fetchGroups'

type FilterProfilesProps = {
  profiles: Pick<Tables<'profiles'>, 'group_id'>[]
  set: Setter<number>
}

const FilterProfiles: Component<FilterProfilesProps> = (props) => {
  const [groups] = createResource(groupsById)
  const groupName = (id: number) => {
    const groupsRecord = groups()
    return groupsRecord ? groupsRecord[id].name : 'Caricamento...'
  }

  const groupCounts = () => Array.from(props.profiles.reduce((counts, profile) => {
    const id = profile.group_id
    counts.set(id, (counts.get(id) ?? 0) + 1)
    return counts
  }, new Map<number, number>()).entries())

  return (
    <select required onInput={(e) => props.set(parseInt(e.target.value))}>
      <option value={0}>Mostra tutti - {props.profiles.length}</option>
      <For each={groupCounts()}>
        {([group_id, count]) => (
          <option value={group_id}>{groupName(group_id)} - {count}</option>
        )}
      </For>
    </select>
  )
}

export default FilterProfiles
