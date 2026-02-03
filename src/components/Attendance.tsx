import { createResource, Show, type Component } from 'solid-js'
import type { AttendancesExtra, ResponseBody } from '../utils/functions.types'
import { useSupabase } from '../utils/context'
import { getGroupFromLS } from '../utils/mixed'
import invokeAttendances from '../utils/invokeAttendances'
import ErrorBox from './ErrorBox'
import { DayOfWeek, DaysOfWeek } from './DayOfWeek'
import GroupName from './GroupName'
import RemoveAttendance from './RemoveAttendance'
import SetAttendance from './SetAttendance'
import './Attendance.sass'

type ManageProps = {
  response: ResponseBody<AttendancesExtra>
  groupId: number
  refetch: () => void
}

const ManageResource: Component<ManageProps> = (props) => {
  const extra = props.response.extra
  if (props.response.code !== 200) return <ErrorBox>{props.response.message}</ErrorBox>
  if (!extra) return <ErrorBox>{`Non dovresti mai vedere questo errore 🤫 - ${props.response.message}`}</ErrorBox>
  if (extra.alreadySet) return (<>
    <p>Presenza di <DayOfWeek day={extra.daySetted} /> a <GroupName id={extra.groupSetted} /> confermata!</p>
    <RemoveAttendance groupId={props.groupId} refetch={props.refetch} />
  </>)
  if (extra.DayNotAllowed) return (<>
    <p>Segnatura presenza a <GroupName id={props.groupId} /> non attiva.</p>
    <p class='more-info'>
      Ritorna qui nei seguenti giorni: <DaysOfWeek days={extra.allowedDays} />.<br />
      Dalle ore {extra.startTime} avrai {extra.openingTime}H di tempo per segnarti!
    </p>
  </>)
  return (<>
    <p>Eri presente <DayOfWeek day={extra.dayOfWeek} /> a <GroupName id={props.groupId} />?</p>
    <SetAttendance groupId={props.groupId} refetch={props.refetch} />
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
