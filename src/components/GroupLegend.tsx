import { createResource, For } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'
import { getGroupAcronym } from '../utils/mixed'
import './GroupLegend.sass'

const GroupLegend = () => {
  const [groups] = createResource(fetchGroups)

  return (
    <div class='group-legend'>
      <p class='title'>Legenda</p>
      <For each={groups()} fallback={<p>Caricamento gruppi...</p>}>
        {(group) => <p><b>{getGroupAcronym(group.name)}</b>={group.name}</p>}
      </For>
    </div>
  )
}

export default GroupLegend
