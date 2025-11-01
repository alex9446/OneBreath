import { createResource, Show } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { getSubscription, subscribeUser, unsubscribeUser } from '../../utils/subscribeUser'
import ErrorBox from '../../components/ErrorBox'

const Notifications = () => {
  const supabaseClient = useSupabase()
  const [subscription, { refetch }] = createResource(getSubscription)

  const activate = action(async () => {
    await subscribeUser(supabaseClient)
    await refetch()
  })
  const useActivate = useAction(activate)
  const activateSubmissions = useSubmission(activate)

  const deactivate = action(async () => {
    await unsubscribeUser()
    await refetch()
  })
  const useDeactivate = useAction(deactivate)
  const deactivateSubmissions = useSubmission(deactivate)

  return (
    <main id='notifications-page'>
      <Show when={subscription()} fallback={
        <button onClick={useActivate} disabled={activateSubmissions.pending}>
          Attiva notifiche
        </button>
      }>
        <button onClick={useDeactivate} disabled={deactivateSubmissions.pending}>
          Disattiva notifiche
        </button>
      </Show>
      <ErrorBox>{activateSubmissions.error}</ErrorBox>
      <ErrorBox>{deactivateSubmissions.error}</ErrorBox>
    </main>
  )
}

export default Notifications
