import { ErrorBoundary, Suspense, type ParentComponent } from 'solid-js'
import ErrorBox from './ErrorBox'

const SuspenseWithError: ParentComponent = (props) => (
  <ErrorBoundary fallback={(err) => <ErrorBox>{err}</ErrorBox>}>
    <Suspense fallback={<p>Caricamento...</p>}>
      {props.children}
    </Suspense>
  </ErrorBoundary>
)

export default SuspenseWithError
