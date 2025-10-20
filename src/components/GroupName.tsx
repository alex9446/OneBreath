import { createResource, Suspense, type Component } from 'solid-js'
import { fetchGroup } from '../utils/fetchGroups'

const GroupName: Component<{ id: number }> = (props) => {
  const [group] = createResource(props.id, fetchGroup)

  return <Suspense><span class='group-name'>{group()?.name}</span></Suspense>
}

export default GroupName
