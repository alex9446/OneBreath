import { createResource, For, Suspense } from 'solid-js'
import { useSupabase } from '../../utils/context'
import Title from '../../components/Title'
import GoBack from '../../components/GoBack'
import './Groups.sass'

const shortDaysOfWeek = ['D','L','Ma','Me','G','V','S','D']

const Groups = () => {
  const supabaseClient = useSupabase()

  const [groups] = createResource(async () => {
    const { data: groups, error } = await supabaseClient.from('groups')
      .select('name,days_of_week').order('id')
    if (error) throw error.message
    return groups
  })

  return (<>
    <Title>Lista gruppi</Title>
    <main id='groups-page'>
      <p>Lista gruppi</p>
      <Suspense fallback='Caricamento...'>
        <div class='grid'>
          <p>Nome gruppo</p><p>Giorni della settimana</p>
          <For each={groups()}>
            {(group) => (<>
              <p>{group.name}</p>
              <p>{group.days_of_week.map((day) => shortDaysOfWeek[day]).join(',')}</p>
            </>)}
          </For>
        </div>
      </Suspense>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Groups
