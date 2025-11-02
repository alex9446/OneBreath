import { createSignal, Show, type ParentComponent } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useSupabase } from '../utils/context'

const RequireLogin: ParentComponent = (props) => {
  const [loggedIn, setLoggedIn] = createSignal(false)
  const navigate = useNavigate()
  const supabaseClient = useSupabase()

  supabaseClient.auth.getSession().then(({ data }) => {
    data.session === null ? navigate('/login') : setLoggedIn(true)
  })

  return (
    <Show when={loggedIn()} fallback={<main><p>Verifica login...</p></main>}>
      {props.children}
    </Show>
  )
}

export default RequireLogin
