import type { ParentComponent } from 'solid-js'
import { Provider } from '../utils/context'
import DomainChangeAlert from './DomainChangeAlert'
import CreditsInFooter from './CreditsInFooter'

const RootComponent: ParentComponent = (props) => (
  <Provider>
    <DomainChangeAlert />
    {props.children}
    <CreditsInFooter />
  </Provider>
)

export default RootComponent
