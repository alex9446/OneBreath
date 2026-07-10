import { createResource, createSignal, For, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { getGroupFromLS } from '../utils/mixed'
import { invokeLeaderboard } from '../utils/invokeFunctions'
import Title from '../components/Title'
import SelectGroup from '../components/SelectGroup'
import GoBack from '../components/GoBack'
import './Leaderboard.sass'

const Leaderboard = () => {
  const supabaseClient = useSupabase()
  const groupId = getGroupFromLS()
  const [selectedGroup, setSelectedGroup] = createSignal(groupId)

  const [leaderboard] = createResource(selectedGroup, (gid) => invokeLeaderboard(supabaseClient, gid))

  return (<>
    <Title>Classifica presenze</Title>
    <main id='leaderboard-page'>
      <p>Classifica presenze</p>
      <SelectGroup defaultOption={groupId} set={setSelectedGroup} />
      <Suspense fallback='Caricamento...'>
        <div class='grid'>
          <p>Nome</p><p>Numero presenze</p>
          <For each={leaderboard()?.extra}>
            {(attendance) => (<>
              <p>{attendance.first_name} {attendance.last_name}</p>
              <p>{attendance.apg}</p>
            </>)}
          </For>
        </div>
      </Suspense>
      <p class='hide-hint'>ℹ️ <A href='/settings'>Puoi nasconderti da questa lista</A></p>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Leaderboard
