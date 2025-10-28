import { createResource, Show, type Component } from 'solid-js'
import type { AttendancesExtra, ResponseBody } from '../utils/functions.types'
import { useSupabase } from '../utils/context'
import { getGroupFromLS } from '../utils/mixed'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from './ErrorBox'
import { DayOfWeek, DaysOfWeek } from './DayOfWeek'
import GroupName from './GroupName'
import SetAttendance from './SetAttendance'

type ManageProps = {response: ResponseBody<AttendancesExtra>, groupId: number, refetch: Function}

const ManageResource: Component<ManageProps> = (props) => {
  const extra = props.response.extra
  if (props.response.code !== 200) return <ErrorBox>{props.response.message}</ErrorBox>
  if (!extra) return <ErrorBox>{'Non dovresti mai vedere questo errore 🤫 - ' + props.response.message}</ErrorBox>
  if (extra.alreadySet) return (
    <p>Presenza di <DayOfWeek day={extra.daySetted} /> a <GroupName id={extra.groupSetted} /> confermata!</p>
  )
  if (extra.DTnotAllowed) return (<>
    <p>Segnatura presenza a <GroupName id={props.groupId} /> non attiva.</p>
    <p class='more-info'>
      Ritorna qui dopo le ore {extra.startTime} dei seguenti giorni: <DaysOfWeek days={extra.allowedDays} />.
    </p>
  </>)
  return (<>
    <p>Eri presente <DayOfWeek day={extra.dayOfWeek} /> a <GroupName id={props.groupId} />?</p>
    <SetAttendance groupId={props.groupId} refetch={props.refetch} />
    <p class='non-cancelable'>Azione non annullabile</p>
  </>)
}

const Attendance = () => {
  const supabaseClient = useSupabase()
  const groupId = getGroupFromLS()

  const [verify, { refetch }] = createResource(groupId, async (gid) => {
    return await invokeAttendances(supabaseClient, 'verify', gid)
  })

  return (
    <Show keyed when={verify()} fallback={<p>Caricamento presenza...</p>}>
      {(dVerify) => <ManageResource response={dVerify} groupId={groupId} refetch={refetch} />}
    </Show>
  )
}

export default Attendance
