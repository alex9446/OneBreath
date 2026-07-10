import { createResource, For, type Component, type Setter } from 'solid-js'
import { useSupabase } from '../utils/context'
import { fetchGroups } from '../utils/fetchGroups'

type SelectGroupProps = {
  defaultOption: number
  ref?: HTMLSelectElement
  set?: Setter<number>
}

const SelectGroup: Component<SelectGroupProps> = (props) => {
  const supabaseClient = useSupabase()
  const [groups] = createResource(() => fetchGroups(supabaseClient))

  return (
    <select ref={props.ref} name='group' required
            onInput={(e) => props.set?.(parseInt(e.currentTarget.value))}
            value={groups.loading ? undefined : props.defaultOption}>
      <For each={groups()} fallback={<option value={404}>Caricamento gruppi...</option>}>
        {(group) => <option value={group.id}>{group.name}</option>}
      </For>
    </select>
  )
}

export default SelectGroup
