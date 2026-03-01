import { createResource, Match, Show, Switch } from 'solid-js'
import { useSupabase } from '../utils/context'
import { getGroupFromLS } from '../utils/mixed'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from './ErrorBox'
import { DayOfWeek, DaysOfWeek } from './DayOfWeek'
import GroupName from './GroupName'
import RemoveAttendance from './RemoveAttendance'
import SetAttendance from './SetAttendance'
import './Attendance.sass'

const Attendance = () => {
  const supabaseClient = useSupabase()
  const groupId = getGroupFromLS()

  const [verify, { refetch }] = createResource(() => (
    invokeAttendances(supabaseClient, 'verify', groupId)
  ))

  return (
    <Show keyed when={verify()?.code === 200 && verify()?.extra} fallback={
      <Show when={verify.loading} fallback={<ErrorBox>{verify()?.message}</ErrorBox>}>
        <p>Caricamento presenza...</p>
      </Show>
    }>
      {(extraUnion) => (
        <Switch>
          <Match when={extraUnion.state === 'already-set' && extraUnion}>
            {(extra) => (<>
              <p>Presenza di <DayOfWeek day={extra().daySetted} /> a <GroupName id={extra().groupSetted} /> confermata!</p>
              <RemoveAttendance groupId={groupId} refetch={refetch} />
            </>)}
          </Match>
          <Match when={extraUnion.state === 'day-not-allowed' && extraUnion}>
            {(extra) => (<>
              <p>Segnatura presenza a <GroupName id={groupId} /> non attiva.</p>
              <p class='more-info'>
                Ritorna qui nei seguenti giorni: <DaysOfWeek days={extra().allowedDays} />.<br />
                Dalle ore {extra().startTime} avrai {extra().openingTime}H di tempo per segnarti!
              </p>
            </>)}
          </Match>
          <Match when={extraUnion.state === 'settable' && extraUnion}>
            {(extra) => (<>
              <p>Eri presente <DayOfWeek day={extra().dayOfWeek} /> a <GroupName id={groupId} />?</p>
              <SetAttendance groupId={groupId} refetch={refetch} />
            </>)}
          </Match>
        </Switch>
      )}
    </Show>
  )
}

export default Attendance
