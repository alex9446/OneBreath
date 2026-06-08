import { createResource, type Component } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

const GroupName: Component<{ id: number }> = (props) => {
  const [groupName] = createResource(props.id, async (id) => (
    (await fetchGroups()).find((group) => group.id === id)?.name
  ))

  return <span>{groupName() ?? 'Gruppo senza nome'}</span>
}

export default GroupName
