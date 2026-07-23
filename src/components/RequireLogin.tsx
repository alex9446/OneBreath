import { createEffect, createResource, Show, type ParentComponent } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useSupabase } from '../utils/supabaseContext'
import { UserIdProvider } from '../utils/userIdContext'
import { LoggedOnMount } from './OnMountSupabase'

const RequireLogin: ParentComponent = (props) => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()

  const [session] = createResource(async () => (
    (await supabaseClient.auth.getSession()).data.session
  ))

  createEffect(() => session() === null && navigate('/login'))

  return (
    <Show when={session()} fallback={<main><p>Verifica login...</p></main>}>
      {(definedSession) => (
        <UserIdProvider userId={definedSession().user.id}>
          {props.children}
          <LoggedOnMount />
        </UserIdProvider>
      )}
    </Show>
  )
}

export default RequireLogin
