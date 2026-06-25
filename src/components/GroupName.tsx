import { createResource, type Component } from 'solid-js'
import { useSupabase } from '../utils/context'
import { fetchGroups } from '../utils/fetchGroups'

const GroupName: Component<{ id: number }> = (props) => {
  const supabaseClient = useSupabase()
  const [groupName] = createResource(props.id, async (id) => (
    (await fetchGroups(supabaseClient)).find((group) => group.id === id)?.name
  ))

  return <span>{groupName() ?? 'Gruppo senza nome'}</span>
}

export default GroupName
