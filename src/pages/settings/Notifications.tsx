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
  const activateSubmission = useSubmission(activate)
  const activateClick = () => {
    activateSubmission.clear() // workaround to remove the last submission error
    useActivate()
  }

  const deactivate = action(async () => {
    await unsubscribeUser()
    await refetch()
  })
  const useDeactivate = useAction(deactivate)
  const deactivateSubmission = useSubmission(deactivate)
  const deactivateClick = () => {
    deactivateSubmission.clear() // workaround to remove the last submission error
    useDeactivate()
  }

  return (
    <main id='notifications-page'>
      <Show when={subscription()} fallback={
        <button onClick={activateClick} disabled={activateSubmission.pending}>
          Attiva notifiche
        </button>
      }>
        <button onClick={deactivateClick} disabled={deactivateSubmission.pending}>
          Disattiva notifiche
        </button>
      </Show>
      <ErrorBox>{activateSubmission.error}</ErrorBox>
      <ErrorBox>{deactivateSubmission.error}</ErrorBox>
    </main>
  )
}

export default Notifications
