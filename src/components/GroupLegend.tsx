import { createResource, For } from 'solid-js'
import { useSupabase } from '../utils/context'
import { fetchGroups } from '../utils/fetchGroups'
import { getGroupAcronym } from '../utils/mixed'
import './GroupLegend.sass'

const GroupLegend = () => {
  const supabaseClient = useSupabase()
  const [groups] = createResource(() => fetchGroups(supabaseClient))

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
