import { createResource, For, Suspense, type Component } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

const SelectGroup: Component<{ defaultOption: number }> = (props) => {
  const [groups] = createResource(fetchGroups)

  return (
    <select name='group' required>
      <Suspense fallback={<option value={404}>Caricamento gruppi...</option>}>
        <For each={groups()}>
          {(group) => <>
            <option value={group.id} selected={group.id === props.defaultOption}>
              {group.name}
            </option>
          </>}
        </For>
      </Suspense>
    </select>
  )
}

export default SelectGroup
