import { createResource, For, Suspense, type Component } from 'solid-js'
import { useSupabase } from '../utils/supabaseContext'
import { groupsById } from '../utils/fetchGroups'
import { getDateLocaleIT } from '../utils/mixed'
import GroupLegend from '../components/GroupLegend'
import './UserAttendances.sass'

const UserAttendances: Component<{ id: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [attendances] = createResource(async () => {
    const groups = await groupsById(supabaseClient)
    const { data: attendances, error } = await supabaseClient.from('attendances')
      .select('marked_day,group_id')
      .eq('user_id', props.id)
      .order('marked_day', { ascending: false })
    if (error) throw error.message
    return attendances.map((attendance) => ({
      markedDay: getDateLocaleIT(attendance.marked_day, true),
      groupAcronym: groups[attendance.group_id]?.acronym
    }))
  })

  return (<>
    <GroupLegend />
    <Suspense fallback='Caricamento...'>
      <div class='user-attendances-grid'>
        <p>Data</p><p>Gruppo</p>
        <For each={attendances()}>
          {(attendance) => (<>
            <p>{attendance.markedDay}</p><p>{attendance.groupAcronym}</p>
          </>)}
        </For>
      </div>
    </Suspense>
  </>)
}

export default UserAttendances
