import { createResource, For, Suspense, type Component } from 'solid-js'
import { useSupabase } from '../utils/context'
import { getUserId } from '../utils/mixed.supabase'
import { getFirstChars } from '../utils/mixed'
import GroupLegend from '../components/GroupLegend'
import './UserAttendances.sass'

const UserAttendances: Component<{ id?: string }> = (props) => {
  const supabaseClient = useSupabase()

  const [attendances] = createResource(async () => {
    const userId = props.id ?? await getUserId(supabaseClient)
    const { data: attendances, error } = await supabaseClient.from('pretty_attendances')
      .select('marked_day,group_name').eq('user_id', userId)
    if (error) throw error.message
    return attendances
  })

  return (<>
    <GroupLegend />
    <Suspense fallback='Caricamento...'>
      <div class='user-attendances-grid'>
        <p>Data</p><p>Gruppo</p>
        <For each={attendances()}>
          {(attendance) => (<>
            <p>{attendance.marked_day}</p><p>{getFirstChars(attendance.group_name)}</p>
          </>)}
        </For>
      </div>
    </Suspense>
  </>)
}

export default UserAttendances
