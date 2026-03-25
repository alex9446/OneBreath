import { createResource, type Component } from 'solid-js'
import { fetchGroups } from '../utils/fetchGroups'

const GroupName: Component<{ id: number }> = (props) => {
  const [groups] = createResource(fetchGroups)
  const groupName = () => groups()?.find((group) => group.id === props.id)?.name

  return <span>{groupName() ?? 'Gruppo senza nome'}</span>
}

export default GroupName
