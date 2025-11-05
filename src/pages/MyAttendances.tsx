import { createResource, For, Suspense } from 'solid-js'
import { useSupabase } from '../utils/context'
import FakeButton from '../components/FakeButton'
import './MyAttendances.sass'

const MyAttendances = () => {
  const supabaseClient = useSupabase()

  const [myattendances] = createResource(async () => {
    const { data: myattendances, error } = await supabaseClient.from('myattendances').select('marked_day,group_name')
    if (error) throw error.message
    return myattendances
  })

  return (
    <main id='myattendances-page'>
      <p>Le mie presenze</p>
      <Suspense fallback='Caricamento...'>
        <div>
          <p>Data</p><p>Gruppo</p>
          <For each={myattendances()}>
            {(attendance) => (<>
              <p>{attendance.marked_day}</p><p>{attendance.group_name}</p>
            </>)}
          </For>
        </div>
      </Suspense>
      <FakeButton href='/'>Torna indietro</FakeButton>
    </main>
  )
}

export default MyAttendances
