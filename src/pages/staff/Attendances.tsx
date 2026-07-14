import { createMemo, createResource, For } from 'solid-js'
import { A, useNavigate, useParams } from '@solidjs/router'
import { getGroupFromLS, getTodayDate } from '../../utils/mixed'
import { useSupabase } from '../../utils/context'
import { W12H24MenuLeft, W12H24MenuRight } from '../../utils/iconPaths'
import Title from '../../components/Title'
import SelectGroup from '../../components/SelectGroup'
import Icon from '../../components/Icon'
import FakeButton from '../../components/FakeButton'
import './Attendances.sass'

const Attendances = () => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()
  const params = useParams()
  const todayDate = getTodayDate()
  const options = createMemo(() => {
    const [groupStr = '', date] = params['groupDate']?.split('g') ?? []
    const group = parseInt(groupStr)
    if (Number.isNaN(group) || !date) return { group: getGroupFromLS(), date: todayDate }
    return { group, date }
  })

  const [attendances, {mutate}] = createResource(options, async ({ group, date }) => {
    const { data: attendances, error } = await supabaseClient.from('attendances_with_name')
      .select('user_id,fullname').eq('group_id', group).eq('marked_day', date)
    if (error) throw error.message
    return attendances
  })

  let selectGroup!: HTMLSelectElement
  let inputDate!: HTMLInputElement

  const onInputEvent = () => {
    if (!inputDate.value) return
    mutate([])
    navigate(`${params['groupDate'] ? '..' : '.'}/${selectGroup.value}g${inputDate.value}`)
  }

  const changeDate = (days: number) => {
    let date = inputDate.valueAsDate
    if (!date) return
    const { value } = inputDate
    if (days < 0 && value === inputDate.min) return
    if (days > 0 && value === inputDate.max) return
    date.setDate(date.getDate() + days)
    inputDate.valueAsDate = date
    onInputEvent()
  }

  const backPath = () => params['groupDate'] ? '../..' : '..'

  return (<>
    <Title>Area staff &gt; Storico presenze</Title>
    <main id='attendances-page'>
      <SelectGroup ref={selectGroup} defaultOption={options().group} set={onInputEvent} />
      <div class='date-selector'>
        <Icon path={W12H24MenuLeft} width={18} viewBox='12 24'
              title='giorno precedente' onClick={() => changeDate(-1)} />
        <input type='date' ref={inputDate} required onInput={onInputEvent}
               value={options().date} min='2025-10-23' max={todayDate} />
        <Icon path={W12H24MenuRight} width={18} viewBox='12 24'
              title='giorno successivo' onClick={() => changeDate(1)} />
      </div>
      <p>{attendances.loading ? 'Caricamento...' : `Totale: ${attendances()?.length}`}</p>
      <ul>
        <For each={attendances()}>
          {(attendance) => (
            <li>
              <A href={`${backPath()}/athletes/${attendance.user_id}`}>{attendance.fullname}</A>
            </li>
          )}
        </For>
      </ul>
    </main>
    <nav>
      <FakeButton href={backPath()}>Torna indietro</FakeButton>
    </nav>
  </>)
}

export default Attendances
