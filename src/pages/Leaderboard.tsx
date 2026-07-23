import { createResource, createSignal, For, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { useSupabase } from '../utils/supabaseContext'
import { currentSeason, getGroupFromLS } from '../utils/mixed'
import { invokeLeaderboard } from '../utils/invokeFunctions'
import Title from '../components/Title'
import SelectGroup from '../components/SelectGroup'
import SelectSeason from '../components/SelectSeason'
import GoBack from '../components/GoBack'
import './Leaderboard.sass'

const Leaderboard = () => {
  const supabaseClient = useSupabase()
  const groupId = getGroupFromLS()
  const [selectedGroup, setSelectedGroup] = createSignal(groupId)
  const [selectedSeason, setSelectedSeason] = createSignal<number | undefined>(currentSeason())

  const [leaderboard] = createResource(
    () => ({ groupId: selectedGroup(), season: selectedSeason() }),
    ({groupId, season}) => invokeLeaderboard(supabaseClient, groupId, season)
  )

  return (<>
    <Title>Classifica presenze</Title>
    <main id='leaderboard-page'>
      <p>Classifica presenze</p>
      <SelectGroup defaultOption={groupId} set={setSelectedGroup} />
      <SelectSeason value={selectedSeason()} set={setSelectedSeason} />
      <Suspense fallback='Caricamento...'>
        <div class='grid'>
          <p>Nome</p><p>Numero presenze</p>
          <For each={leaderboard()?.extra}>
            {(athlete) => (<>
              <p>{athlete.fullname}</p>
              <p>{athlete.attendances}</p>
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
