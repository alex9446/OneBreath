import { base64ToUint8Array, sha256 } from './mixed'
import type { SupabaseClientDB } from '@shared/shortcut.types'
import { getUserId, silentTrackEvent } from './mixed.supabase'

const subscriptionJson = (subscription: PushSubscription) => {
  return JSON.stringify(subscription.toJSON())
}

const subscriptionSha = async (subscription: PushSubscription) => {
  return await sha256(subscriptionJson(subscription))
}

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

const sendToServer = async (supabaseClient: SupabaseClientDB,
                            subscription: PushSubscription) => {
  const userId = await getUserId(supabaseClient)
  const { error } = await supabaseClient.from('subscriptions').insert([
    { user_id: userId, subscription_json: subscriptionJson(subscription) }
  ])
  if (error) throw error.message
}

export const subscribeUser = async (supabaseClient: SupabaseClientDB) => {
  const subscription = await createSubscription()
  await sendToServer(supabaseClient, subscription)
  localStorage.setItem('subscriptionHash', await subscriptionSha(subscription))
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
  try {
    if (!await subscribeIsSupported()) return
    const subscription = await getSubscription()
    if (subscription) {
      const subscriptionHash = await subscriptionSha(subscription)
      if (localStorage.getItem('subscriptionHash') === subscriptionHash) return
      await sendToServer(supabaseClient, subscription)
      localStorage.setItem('subscriptionHash', subscriptionHash)
    } else if (Notification.permission === 'granted') {
      const metadata = { user_agent: navigator.userAgent }
      await silentTrackEvent(supabaseClient, 'notification-granted', metadata)
    }
  } catch {}
}
