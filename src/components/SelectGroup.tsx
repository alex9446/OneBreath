import { createResource, For, type Component } from 'solid-js'
import { useSupabase } from '../utils/supabaseContext'
import { fetchGroups } from '../utils/fetchGroups'

type SelectGroupProps = {
  defaultOption: number
  set?: (value: number) => void
}

const SelectGroup: Component<SelectGroupProps> = (props) => {
  const supabaseClient = useSupabase()
  const [groups] = createResource(() => fetchGroups(supabaseClient))

  return (
    <select name='group' required value={groups.loading ? undefined : props.defaultOption}
            onInput={(e) => props.set?.(parseInt(e.currentTarget.value))}>
      <For each={groups()} fallback={<option value={404}>Caricamento gruppi...</option>}>
        {(group) => <option value={group.id}>{group.name}</option>}
      </For>
    </select>
  )
}

export default SelectGroup
