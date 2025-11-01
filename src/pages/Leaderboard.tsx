import { createResource, For, Suspense } from 'solid-js'
import { A } from '@solidjs/router'
import { getGroupFromLS } from '../utils/mixed'
import invokeLeaderboard from '../utils/invokeLeaderboard'
import GroupName from '../components/GroupName'
import FakeButton from '../components/FakeButton'
import './Leaderboard.sass'

const Leaderboard = () => {
  const groupId = getGroupFromLS()

  const [leaderboard] = createResource(groupId, async (gid) => await invokeLeaderboard(gid))

  return (
    <main id='leaderboard-page'>
      <p>Classifica presenze <GroupName id={groupId} /></p>
      <Suspense fallback='Caricamento...'>
        <div>
          <p>Nome</p><p>Numero presenze</p>
          <For each={leaderboard()?.extra}>
            {(attendance) => (<>
              <p>{attendance.first_name}</p><p>{attendance.apg}</p>
            </>)}
          </For>
        </div>
      </Suspense>
      <p class='hide-hint'>ℹ️ <A href='/settings'>Puoi nasconderti da questa lista</A></p>
      <FakeButton href='/'>Torna indietro</FakeButton>
    </main>
  )
}

export default Leaderboard
