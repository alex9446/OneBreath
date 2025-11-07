import { createResource, For, type Component } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

const SelectGroup: Component<{ defaultOption: number }> = (props) => {
  const [groups] = createResource(fetchGroups)

  return (
    <select name='group' required>
      <For each={groups()} fallback={<option value={404}>Caricamento gruppi...</option>}>
        {(group) => <>
          <option value={group.id} selected={group.id === props.defaultOption}>
            {group.name}
          </option>
        </>}
      </For>
    </select>
  )
}

export default SelectGroup
