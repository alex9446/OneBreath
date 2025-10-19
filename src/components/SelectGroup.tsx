import { createResource, For, Suspense } from 'solid-js'
import { useSupabase } from '../utils/context'

const SelectGroup = () => {
  const supabaseClient = useSupabase()!

  const [groups] = createResource(async () => {
    const { data: groups, error } = await supabaseClient.from('groups').select('id,name').order('id')
    if (error) throw error.message
    return groups
  })

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
