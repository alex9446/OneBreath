import { ErrorBoundary, type ParentComponent } from 'solid-js'
import ErrorBox from './ErrorBox'

const ErrorBoundaryBox: ParentComponent = (props) => (
  <ErrorBoundary fallback={(err) => <ErrorBox>{err}</ErrorBox>}>
    {props.children}
  </ErrorBoundary>
)

export default ErrorBoundaryBox
