import { onCleanup, onMount } from 'solid-js'
import { useSupabase } from '../utils/context'
import { silentSubscriptionUpdate } from '../utils/subscribeUser'

const LoggedOnMount = () => {
  const supabaseClient = useSupabase()

  onMount(() => {
    const pageLoaded = () => {
      silentSubscriptionUpdate(supabaseClient)
    }

    window.addEventListener('load', pageLoaded)
    onCleanup(() => window.removeEventListener('load', pageLoaded))
    if (document.readyState === 'complete') {
      window.removeEventListener('load', pageLoaded)
      pageLoaded()
    }
  })

  return null
}

export default LoggedOnMount
