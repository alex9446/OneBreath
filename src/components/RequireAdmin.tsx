import { Show, type ParentComponent } from 'solid-js'
import { A } from '@solidjs/router'
import { getAdminInLS } from '../utils/mixed'

const notAdmin = () => (
  <main>
    <p>Pagina riservata agli utenti staff</p>
    <A href='/'>Ritorna alla homepage</A>
  </main>
)

const RequireAdmin: ParentComponent = (props) => (
  <Show when={getAdminInLS() >= 1} fallback={notAdmin()}>
    {props.children}
  </Show>
)

export default RequireAdmin
