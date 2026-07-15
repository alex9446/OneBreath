import { For } from 'solid-js'
import { range } from '../utils/mixed'

const PREDICTED_GROUPS = 9

const FallbackGroups = () => (
  <For each={range(1, PREDICTED_GROUPS + 1)}>
    {(id) => (
      <div>
        <input type='radio' name='group' id={`group${id}`} required value={0} />
        <label for={`group${id}`}>Caricamento {id}...</label>
      </div>
    )}
  </For>
)

export default FallbackGroups
