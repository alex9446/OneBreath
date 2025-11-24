import { onCleanup, onMount, type ParentComponent } from 'solid-js'

const baseTitle = 'Soci OneBreath - '
const defaultTitle = 'Soci OneBreath'

const Title: ParentComponent = (props) => {
  onMount(() => {
    if (typeof props.children === 'string') {
      document.title = baseTitle + props.children
    } else {
      document.title = defaultTitle
    }
  })

  onCleanup(() => document.title = defaultTitle)

  return null
}

export default Title
