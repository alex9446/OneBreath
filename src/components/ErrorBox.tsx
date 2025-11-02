import { Show, type ParentComponent } from 'solid-js'
import manageRawError from '../utils/manageRawError'

const ErrorBox: ParentComponent = (props) => {
  const error_message = () => manageRawError(props.children)

  return (
    <Show when={error_message()}>
      <p style='color:red'>{error_message()}</p>
    </Show>
  )
}

export default ErrorBox
