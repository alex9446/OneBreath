import { onCleanup, onMount } from 'solid-js'
import { useLocation, useNavigate } from '@solidjs/router'
import { useSupabase } from '../utils/context'
import { silentSubscriptionUpdate } from '../utils/subscribeUser'

export const GenericOnMount = () => {
  const supabaseClient = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()

  const signedOutPages = ['/register', '/login', '/login/forgottenpassword']

  onMount(() => {
    const authState = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { navigate('/login') }
      else if (event === 'SIGNED_IN') {
        if (signedOutPages.includes(location.pathname)) navigate('/')
      }
    })

    onCleanup(() => authState.data.subscription.unsubscribe())
  })

  return null
}

export const LoggedOnMount = () => {
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
