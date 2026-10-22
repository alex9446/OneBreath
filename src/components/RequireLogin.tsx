import { createEffect, createResource, Show, type Component, type ParentComponent, type Resource } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import type { Session } from '@supabase/supabase-js'
import { useSupabase } from '../utils/supabaseContext'
import { UserIdProvider } from '../utils/userIdContext'
import { LoggedOnMount } from './OnMountSupabase'
import ErrorBox from './ErrorBox'

const SessionError: Component<{session: Resource<Session | null>}> = (props) => (
  <main>
    <ErrorBox>{props.session.error}</ErrorBox>
    <p><A href='/login'>Riprova ad effettuare il login</A></p>
  </main>
)

const RequireLogin: ParentComponent = (props) => {
  const navigate = useNavigate()
  const supabaseClient = useSupabase()

  const [session] = createResource(async () => (
    (await supabaseClient.auth.getSession()).data.session
  ))

  createEffect(() => !session.error && session() === null && navigate('/login'))

  return (
    <Show when={!session.error} fallback={<SessionError session={session} />}>
      <Show when={session()} fallback={<main><p>Verifica login...</p></main>}>
        {(definedSession) => (
          <UserIdProvider userId={definedSession().user.id}>
            {props.children}
            <LoggedOnMount />
          </UserIdProvider>
        )}
      </Show>
    </Show>
  )
}

export default RequireLogin
