import { createResource, For, Suspense } from 'solid-js'
import { useSupabase } from '../../utils/context'
import { getDateLocaleIT } from '../../utils/mixed'
import Title from '../../components/Title'
import GoBack from '../../components/GoBack'
import './MidweekHolidays.sass'

const MidweekHolidays = () => {
  const supabaseClient = useSupabase()

  const [midweek_holidays] = createResource(async () => {
    const { data, error } = await supabaseClient.from('midweek_holidays').select('date')
    if (error) throw error.message
    return data.map((d) => d.date)
  })

  return (<>
    <Title>Giorni festivi infrasettimanali</Title>
    <main id='midweek-holidays-page'>
      <p>Giorni festivi infrasettimanali</p>
      <Suspense fallback='Caricamento...'>
        <div>
          <For each={midweek_holidays()}>
            {(holiday) => <p>{getDateLocaleIT(holiday)}</p>}
          </For>
        </div>
      </Suspense>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default MidweekHolidays
