import { createResource, Match, Show, Switch } from 'solid-js'
import { useSupabase } from '../utils/context'
import invokeAttendances from '../utils/invokeAttendances'
import DayOfWeek from './DayOfWeek'
import GroupName from './GroupName'
import SetAttendance from './SetAttendance'

const Attendance = () => {
  const supabaseClient = useSupabase()
  const groupId = parseInt(localStorage.getItem('group_id')!)

  const [verify, { refetch }] = createResource(groupId, async (gid) => {
    return await invokeAttendances(supabaseClient, 'verify', gid)
  })

  return (
    <Show when={verify()} fallback={<p>Caricamento presenza...</p>}>
      <Switch fallback={<p class='error-box'>Errore non gestito</p>}>
        <Match when={verify()!.code === 200 && 'day_of_week' in verify()!.extra}>
          <p>Eri presente <DayOfWeek day={(verify()!.extra.day_of_week!)-1} />
          &nbsp;a <GroupName id={groupId} />?</p>
          <SetAttendance groupId={groupId} refetch={refetch} />
          <p class='red-text'>Azione non annullabile</p>
        </Match>
        <Match when={verify()!.code === 403}>
          <Show fallback={<p>Segnatura presenza a <GroupName id={groupId} /> non attiva</p>}
                when={'group_setted' in verify()!.extra && 'day_setted' in verify()!.extra}>
            <p>Presenza di <DayOfWeek day={(verify()!.extra.day_setted!)-1} />
            &nbsp;a <GroupName id={verify()!.extra.group_setted!} /> confermata!</p>
          </Show>
        </Match>
        <Match when={'message' in verify()!}>
          <p class='error-box'>{verify()!.message}</p>
        </Match>
      </Switch>
    </Show>
  )
}

export default Attendance
