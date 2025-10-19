import { createResource, Suspense, type Component } from 'solid-js'
import { fetchGroup } from '../utils/fetchGroups'

export const GroupName: Component<{ id: number }> = (props) => {
  const [group_name] = createResource(props.id, async (id) => {
    const group = await fetchGroup(id)
    if (!group) throw 'Mismatch with group select'
    return group.name
  })

  return <Suspense><span class='group-name'>{group_name()}</span></Suspense>
}
