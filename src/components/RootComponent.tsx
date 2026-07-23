import { onCleanup, onMount, type ParentComponent } from 'solid-js'
import { SupabaseProvider } from '../utils/supabaseContext'
import DomainChangeAlert from './DomainChangeAlert'
import CreditsInFooter from './CreditsInFooter'
import { GenericOnMount } from './OnMountSupabase'

const RootComponent: ParentComponent = (props) => {
  onMount(() => {
    const reloadOnImportError = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason)
      if (reason.includes('error loading dynamically imported module')) {
        if (sessionStorage.getItem('reload-once')) return
        sessionStorage.setItem('reload-once', 'true') // Avoid infinite loops
        window.location.reload()
      }
    }

    window.addEventListener('unhandledrejection', reloadOnImportError)
    onCleanup(() => window.removeEventListener('unhandledrejection', reloadOnImportError))

    const registerServiceWorker = () => {
      if (import.meta.env.PROD) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js')
            .catch((err) => console.error('serviceWorker registration error: ', err))
        } else { console.error('serviceWorker not in navigator') }
      }
    }

    const pageLoaded = () => {
      registerServiceWorker()
      sessionStorage.removeItem('reload-once')
    }

    window.addEventListener('load', pageLoaded)
    onCleanup(() => window.removeEventListener('load', pageLoaded))
    if (document.readyState === 'complete') {
      window.removeEventListener('load', pageLoaded)
      pageLoaded()
    }
  })

  return (
    <SupabaseProvider>
      <DomainChangeAlert />
      {props.children}
      <CreditsInFooter />
      <GenericOnMount />
    </SupabaseProvider>
  )
}

export default RootComponent
