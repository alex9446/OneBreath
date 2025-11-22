import { createResource, For } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { getGroupFromLS } from '../../utils/mixed'
import { useSupabase } from '../../utils/context'
import SelectGroup from '../../components/SelectGroup'
import FakeButton from '../../components/FakeButton'
import './Attendances.sass'

const splitGroupDate = (groupDate: string | undefined, today: string): [number, string] => {
  if (!groupDate) return [ getGroupFromLS(), today ]
  const groupDateSplitted = groupDate.split('G')
  return [ parseInt(groupDateSplitted[0]), groupDateSplitted[1] ]
}

const Attendances = () => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()
  const params = useParams()
  const todayDate = new Date().toLocaleDateString('en-CA')  // en-CA because by default it formats dates as yyyy-mm-dd
  const [defaultGroup, defaultDate] = splitGroupDate(params.groupDate, todayDate)

  const [attendances, {mutate}] = createResource(
    () => splitGroupDate(params.groupDate, todayDate),
    async ([group, date]) => {
      const { data: attendances, error } = await supabaseClient.from('attendances_with_name')
        .select('name').eq('group_id', group).eq('marked_day', date)
      if (error) throw error.message
      return attendances
    }
  )

  let selectGroup!: HTMLSelectElement
  let inputDate!: HTMLInputElement

  const onInputEvent = () => {
    mutate([])
    navigate(`${params.groupDate ? '..' : '.'}/${selectGroup.value}G${inputDate.value}`)
  }

  return (<>
    <main id='attendances-page'>
      <SelectGroup ref={selectGroup} defaultOption={defaultGroup} onInput={onInputEvent} />
      <input type='date' ref={inputDate} required onInput={onInputEvent}
             value={defaultDate} max={todayDate} />
      <p>{attendances.loading ? 'Caricamento...' : `Totale: ${attendances()?.length}`}</p>
      <ul>
        <For each={attendances()}>
          {(attendance) => <li>{attendance.name}</li>}
        </For>
      </ul>
    </main>
    <footer>
      <FakeButton href={params.groupDate ? '../..' : '..'}>Torna indietro</FakeButton>
    </footer>
  </>)
}

export default Attendances
