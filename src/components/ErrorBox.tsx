import type { ParentComponent } from 'solid-js'
import manageRawError from '../utils/manageRawError'

const ErrorBox: ParentComponent = (props) => {
  return <p style='color:red'>{manageRawError(props.children)}</p>
}

export default ErrorBox
