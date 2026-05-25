import { base64ToUint8Array, sha256 } from './mixed'
import type { SupabaseClientDB } from '@shared/shortcut.types'
import { getUserId } from './mixed.supabase'

export const getSubscription = async () => {
  const registration = await navigator.serviceWorker.ready
  return await registration.pushManager.getSubscription()
}

const createSubscription = async () => {
  const registration = await navigator.serviceWorker.ready
  const convertedVapidKey = base64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  })
}

const sendToServer = async (subscription: PushSubscription,
                            supabaseClient: SupabaseClientDB) => {
  const userId = await getUserId(supabaseClient)
  const { error } = await supabaseClient.from('subscriptions').insert([
    { user_id: userId, subscription_json: JSON.stringify(subscription.toJSON()) }
  ])
  if (error) throw error.message
}

export const subscribeUser = async (supabaseClient: SupabaseClientDB) => {
  const subscription = await createSubscription()
  await sendToServer(subscription, supabaseClient)
}

export const unsubscribeUser = async () => (await getSubscription())?.unsubscribe()

export const subscribeIsSupported = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    if ('pushManager' in registration && 'subscribe' in registration.pushManager) {
      return true
    }
  }
  return false
}

export const silentSubscriptionUpdate = async (supabaseClient: SupabaseClientDB) => {
  if (!await subscribeIsSupported()) return
  const subscription = await getSubscription()
  if (subscription) {
    const subscriptionHash = await sha256(JSON.stringify(subscription))
    if (localStorage.getItem('subscriptionHash') === subscriptionHash) return
    try { await sendToServer(subscription, supabaseClient) } catch {}
    localStorage.setItem('subscriptionHash', subscriptionHash)
  } else if (Notification.permission === 'granted') {
    const userId = await getUserId(supabaseClient)
    const metadata = { user_agent: navigator.userAgent }
    await supabaseClient.from('tracking_events').insert([
      { user_id: userId, event_name: 'notification-granted', metadata }
    ])
  }
}
