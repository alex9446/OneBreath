import { createResource, For, type Component } from 'solid-js'
import { useSupabase } from '../utils/supabaseContext'
import { groupsById } from '../utils/fetchGroups'
import { getDateLocaleIT, getDateTimeLocaleIT } from '../utils/mixed'
import GroupLegend from '../components/GroupLegend'
import SuspenseWithError from './SuspenseWithError'
import './UserAttendances.sass'

const UserAttendances: Component<{ id: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [attendances] = createResource(async () => {
    const groups = await groupsById(supabaseClient)
    const { data: attendances, error } = await supabaseClient.from('attendances')
      .select('created_at,marked_day,group_id')
      .eq('user_id', props.id)
      .order('marked_day', { ascending: false })
    if (error) throw error.message
    return attendances.map((attendance) => ({
      createdAt: getDateTimeLocaleIT(attendance.created_at),
      markedDay: getDateLocaleIT(attendance.marked_day, true),
      groupAcronym: groups[attendance.group_id]?.acronym
    }))
  })

  return (<>
    <GroupLegend />
    <SuspenseWithError>
      <div class='user-attendances-grid'>
        <p>Data</p><p>Gruppo</p>
        <For each={attendances()}>
          {(attendance) => (<>
            <p title={`Confermata il: ${attendance.createdAt}`}>{attendance.markedDay}</p>
            <p>{attendance.groupAcronym}</p>
          </>)}
        </For>
      </div>
    </SuspenseWithError>
  </>)
}

export default UserAttendances
