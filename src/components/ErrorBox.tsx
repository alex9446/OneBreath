import { Show, type ParentComponent } from 'solid-js'
import manageRawError from '../utils/manageRawError'

const ErrorBox: ParentComponent = (props) => (
  <Show when={manageRawError(props.children)}>
    {(error_message) => <p style='color:red'>{error_message()}</p>}
  </Show>
)

export default ErrorBox
