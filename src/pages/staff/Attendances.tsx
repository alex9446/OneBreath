import { createMemo, createResource, For } from 'solid-js'
import { A, useNavigate, useParams } from '@solidjs/router'
import { getDateString, getGroupFromLS, getTodayDate } from '../../utils/mixed'
import { useSupabase } from '../../utils/supabaseContext'
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
  const minDate = '2025-10-23'
  const maxDate = getTodayDate()

  const options = createMemo(() => {
    const [groupStr = '', date] = params['groupDate']?.split('g') ?? []
    const group = parseInt(groupStr)
    if (Number.isNaN(group) || !date) return { group: getGroupFromLS(), date: maxDate }
    return { group, date }
  })

  const [attendances, {mutate}] = createResource(options, async ({ group, date }) => {
    const { data: attendances, error } = await supabaseClient.from('attendances_with_name')
      .select('user_id,fullname').eq('group_id', group).eq('marked_day', date)
    if (error) throw error.message
    return attendances
  })

  const navigateToRoute = (group: number, date: string) => {
    mutate([])
    navigate(`${params['groupDate'] ? '..' : '.'}/${group}g${date}`)
  }

  const onGroupChange = (group: number) => navigateToRoute(group, options().date)

  const onDateChange = (date: string) => navigateToRoute(options().group, date)

  const canChangeDate = (days: number, date: Date) => {
    if (days < 0 && date <= new Date(minDate)) return false
    if (days > 0 && date >= new Date(maxDate)) return false
    return true
  }

  const canChangeDateCL = (days: number) => ({
    disabled: !canChangeDate(days, new Date(options().date))
  })

  const changeDate = (days: number) => {
    const date = new Date(options().date)
    if (!canChangeDate(days, date)) return
    date.setDate(date.getDate() + days)
    onDateChange(getDateString(date))
  }

  const backPath = () => params['groupDate'] ? '../..' : '..'

  return (<>
    <Title>Area staff &gt; Storico presenze</Title>
    <main id='attendances-page'>
      <SelectGroup defaultOption={options().group} set={onGroupChange} />
      <div class='date-selector'>
        <Icon path={W12H24MenuLeft} width={18} viewBox='12 24' title='giorno precedente'
              onClick={() => changeDate(-1)} classList={canChangeDateCL(-1)} />
        <input type='date' required onInput={(e) => onDateChange(e.currentTarget.value)}
               value={options().date} min={minDate} max={maxDate} />
        <Icon path={W12H24MenuRight} width={18} viewBox='12 24' title='giorno successivo'
              onClick={() => changeDate(1)} classList={canChangeDateCL(1)} />
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
