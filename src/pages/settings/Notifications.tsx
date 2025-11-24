import { createResource, Show } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import { useSupabase } from '../../utils/context'
import { getSubscription, subscribeUser, unsubscribeUser } from '../../utils/subscribeUser'
import Title from '../../components/Title'
import ErrorBox from '../../components/ErrorBox'
import GoBack from '../../components/GoBack'
import './Notification.sass'

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

  return (<>
    <Title>Impostazioni &gt; Notifiche</Title>
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
      <p class='notice'>
        <b>Avviso:</b> anche se qui hai le notifiche attive non è detto che tu le riceva,
        questo può dipendere dalle impostazioni generali del dispositivo e app browser,
        esecuzione dell'app browser in backgroud oppure altre restrizioni specifiche del dispositivo.
        <br /><br />
        Maggiori info sulle notifiche web ai link sotto:<br />
        <a href='https://support.google.com/chrome/answer/3220216?hl=it' target='_blank'>Chrome</a><br />
        <a href='https://support.mozilla.org/it/kb/notifiche-push' target='_blank'>Firefox</a><br />
        <a href='https://support.apple.com/it-it/guide/safari/sfri40734' target='_blank'>Safari</a><br />
        <a href='https://support.microsoft.com/it-it/microsoft-edge/gestire-le-notifiche-dei-siti-web-in-microsoft-edge-0c555609-5bf2-479d-a59d-fb30a0b80b2b' target='_blank'>Edge</a>
      </p>
    </main>
    <nav>
      <GoBack />
    </nav>
  </>)
}

export default Notifications
