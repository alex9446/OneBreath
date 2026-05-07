import { createResource, For, type Component } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

type SelectGroupProps = {
  defaultOption: number
  ref?: HTMLSelectElement
  onInput?: () => void
}

const SelectGroup: Component<SelectGroupProps> = (props) => {
  const [groups] = createResource(fetchGroups)

  return (
    <select ref={props.ref} name='group' required onInput={props.onInput}
            value={groups.loading ? undefined : props.defaultOption}>
      <For each={groups()} fallback={<option value={404}>Caricamento gruppi...</option>}>
        {(group) => <option value={group.id}>{group.name}</option>}
      </For>
    </select>
  )
}

export default SelectGroup
