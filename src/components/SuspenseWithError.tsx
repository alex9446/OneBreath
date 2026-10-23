import { Suspense, type ParentComponent } from 'solid-js'
import ErrorBoundaryBox from './ErrorBoundaryBox'

const SuspenseWithError: ParentComponent = (props) => (
  <ErrorBoundaryBox>
    <Suspense fallback={<p>Caricamento...</p>}>
      {props.children}
    </Suspense>
  </ErrorBoundaryBox>
)

export default SuspenseWithError
