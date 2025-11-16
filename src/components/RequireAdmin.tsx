import { Show, type ParentComponent } from 'solid-js'
import FakeButton from './FakeButton'
import { getAdminInLS } from '../utils/mixed'

const notAdmin = () => (<>
  <main>
    <p>Pagina riservata agli utenti staff</p>
  </main>
  <footer>
    <FakeButton href='/'>Torna alla homepage</FakeButton>
  </footer>
</>)

const RequireAdmin: ParentComponent = (props) => (
  <Show when={getAdminInLS() >= 1} fallback={notAdmin()}>
    {props.children}
  </Show>
)

export default RequireAdmin
