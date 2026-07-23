import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/supabaseContext'
import { fetchGroups } from '../utils/fetchGroups'
import FallbackGroups from './FallbackGroups'
import './RadioGroup.sass'

const RadioGroup = () => {
  const supabaseClient = useSupabase()
  const [groups] = createResource(() => fetchGroups(supabaseClient))

  return (
    <fieldset class='radio-input'>
      <legend>Seleziona gruppo:</legend>
      <For each={groups()} fallback={<FallbackGroups />}>
        {(group) => (
          <div>
            <input type='radio' name='group' id={`group${group.id}`} required value={group.id} />
            <label for={`group${group.id}`}>{group.name}</label>
          </div>
        )}
      </For>
    </fieldset>
  )
}

export default RadioGroup
