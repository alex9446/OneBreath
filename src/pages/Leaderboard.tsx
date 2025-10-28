import { createResource, For, Suspense } from 'solid-js'
import { getGroupFromLS } from '../utils/mixed'
import { useSupabase } from '../utils/context'
import invokeLeaderboard from '../utils/invokeLeaderboard'
import GroupName from '../components/GroupName'
import FakeButton from '../components/FakeButton'
import './Leaderboard.sass'

const Leaderboard = () => {
  const groupId = getGroupFromLS()
  const supabaseClient = useSupabase()

  const [leaderboard] = createResource(groupId, async (gid) => {
    return await invokeLeaderboard(supabaseClient, gid)
  })

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
      <FakeButton href='/'>Torna indietro</FakeButton>
    </main>
  )
}

export default Leaderboard
