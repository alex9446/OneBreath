import { createResource, For, Suspense } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

const SelectGroup = () => {
  const [groups] = createResource(fetchGroups)

  return (
    <select name='group' required>
      <Suspense fallback={<option value={404}>Caricamento gruppi...</option>}>
        <For each={groups()}>
          {(group) => <option value={group.id}>{group.name}</option>}
        </For>
      </Suspense>
    </select>
  )
}

export default SelectGroup
