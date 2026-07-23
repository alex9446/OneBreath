import { createSignal, onMount, Show } from 'solid-js'
import { action, useAction, useSubmission } from '@solidjs/router'
import Cookies from 'js-cookie'
import { useSupabase } from '../utils/supabaseContext'
import { useUserId } from '../utils/userIdContext'
import { getSubscription, subscribeIsSupported, subscribeUser } from '../utils/subscribeUser'
import { silentTrackEvent } from '../utils/mixed.supabase'
import ErrorBox from './ErrorBox'
import './NotificationBanner.sass'

const NotificationBanner = () => {
  const supabaseClient = useSupabase()
  const userId = useUserId()
  const [showBanner, setShowBanner] = createSignal(false)

  onMount(() => {
    subscribeIsSupported()
      .then((supported) => supported ? getSubscription() : Promise.reject('not supported'))
      .then((subscription) => {
        if(!subscription && !Cookies.get('hideNotificationBanner')) setShowBanner(true)
      })
      .catch(() => {})
  })

  const activate = action(async () => {
    await subscribeUser(supabaseClient, userId)
    setShowBanner(false)
    return { ok: true }
  })
  const useActivate = useAction(activate)
  const activateSubmission = useSubmission(activate)

  const handleLater = () => {
    Cookies.set('hideNotificationBanner', 'yes', { expires: 1 })
    setShowBanner(false)
  }

  const handleNever = () => {
    silentTrackEvent(supabaseClient, userId, 'never-notification-banner')
    Cookies.set('hideNotificationBanner', 'yes', { expires: 365 })
    setShowBanner(false)
  }

  return (
    <Show when={showBanner()}>
      <div class='notification-banner'>
        <p>🔔 <span>Non perdere nessun avviso!</span> Attiva le notifiche</p>
        <div class='actions'>
          <button onClick={useActivate} disabled={activateSubmission.pending}>
            {activateSubmission.pending ? 'Attivazione...' : 'Attiva ora'}
          </button>
          <div>
            <button onClick={handleLater}>Più tardi</button>
            <button onClick={handleNever}>Mai più 😭</button>
          </div>
        </div>
        <ErrorBox>{activateSubmission.error}</ErrorBox>
      </div>
    </Show>
  )
}

export default NotificationBanner
