import { createResource, For } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'
import './RadioGroup.sass'

const FallbackGroups = () => {
  const predictedLength = 7
  const range = Array.from({ length: predictedLength }, (_, i) => i + 1)
  return range.map((id) => (
    <div>
      <input type='radio' name='group' id={`group${id}`} required value={0} />
      <label for={`group${id}`}>Caricamento {id}...</label>
    </div>
  ))
}

const RadioGroup = () => {
  const [groups] = createResource(fetchGroups)

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
