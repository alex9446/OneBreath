import { For, type Component, type Setter } from 'solid-js'
import type { Tables } from '../utils/database.types'

type Profile = Pick<Tables<'profiles'>, 'group_id'> & { groupName: string }
type FilterProfilesProps = {
  defaultOption: number
  profiles: Profile[]
  set: Setter<number>
}

const FilterProfiles: Component<FilterProfilesProps> = (props) => {
  type Count = {
    value: number
    groupName: string
  }
  const groupCounts = () => Array.from(props.profiles.reduce((counts, profile) => {
    const id = profile.group_id
    const value = (counts.get(id)?.value ?? 0) + 1
    counts.set(id, { value, groupName: profile.groupName })
    return counts
  }, new Map<number, Count>()).entries())

  return (
    <select required value={props.defaultOption}
            onInput={(e) => props.set(parseInt(e.target.value))}>
      <option value={0}>Mostra tutti - {props.profiles.length}</option>
      <For each={groupCounts()}>
        {([group_id, info]) => (
          <option value={group_id}>{info.groupName} - {info.value}</option>
        )}
      </For>
    </select>
  )
}

export default FilterProfiles
