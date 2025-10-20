import { createResource, Match, Show, Switch } from 'solid-js'
import { useSupabase } from '../utils/context'
import { getGroupFromLS } from '../utils/mixed'
import invokeAttendances from '../utils/invokeAttendances'
import DayOfWeek from './DayOfWeek'
import GroupName from './GroupName'
import SetAttendance from './SetAttendance'

const Attendance = () => {
  const supabaseClient = useSupabase()
  const groupId = getGroupFromLS()

  const [verify, { refetch }] = createResource(groupId, async (gid) => {
    return await invokeAttendances(supabaseClient, 'verify', gid)
  })

  return (
    <Show when={verify()} fallback={<p>Caricamento presenza...</p>}>
      {(dVerify) => <>
        <Switch fallback={<p class='error-box'>Errore non gestito</p>}>
          <Match when={dVerify().code === 200 && 'day_of_week' in dVerify().extra}>
            <p>Eri presente <DayOfWeek day={(dVerify().extra.day_of_week!)-1} />
            &nbsp;a <GroupName id={groupId} />?</p>
            <SetAttendance groupId={groupId} refetch={refetch} />
            <p class='red-text'>Azione non annullabile</p>
          </Match>
          <Match when={dVerify().code === 403}>
            <Show fallback={<p>Segnatura presenza a <GroupName id={groupId} /> non attiva</p>}
                  when={'group_setted' in dVerify().extra && 'day_setted' in dVerify().extra}>
              <p>Presenza di <DayOfWeek day={(dVerify().extra.day_setted!)-1} />
              &nbsp;a <GroupName id={dVerify().extra.group_setted!} /> confermata!</p>
            </Show>
          </Match>
          <Match when={'message' in dVerify()}>
            <p class='error-box'>{dVerify().message}</p>
          </Match>
        </Switch>
      </>}
    </Show>
  )
}

export default Attendance
