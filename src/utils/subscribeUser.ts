import type { SupabaseClientDB } from '@shared/shortcut.types'
import type { Json } from '@shared/database.types'
import { sha256, urlB64ToUint8Array } from './mixed'
import { silentTrackEvent } from './mixed.supabase'

const subscriptionJson = (subscription: PushSubscription) => (
  JSON.stringify(subscription.toJSON())
)

const subscriptionSha = (subscription: PushSubscription) => (
  sha256(subscriptionJson(subscription))
)

export const getSubscription = async () => {
  const registration = await navigator.serviceWorker.ready
  return await registration.pushManager.getSubscription()
}

const createSubscription = async () => {
  const registration = await navigator.serviceWorker.ready
  const convertedVapidKey = urlB64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  })
}

const sendToServer = async (supabaseClient: SupabaseClientDB, userId: string,
                            subscription: PushSubscription) => {
  const { error } = await supabaseClient.from('subscriptions').insert([
    { user_id: userId, subscription_json: subscription.toJSON() as Json }
  ])
  if (error) throw error.message
}

export const subscribeUser = async (supabaseClient: SupabaseClientDB, userId: string) => {
  const subscription = await createSubscription()
  await sendToServer(supabaseClient, userId, subscription)
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

export const silentSubscriptionUpdate = async (supabaseClient: SupabaseClientDB,
                                               userId: string) => {
  try {
    if (!await subscribeIsSupported()) return
    const subscription = await getSubscription()
    if (subscription) {
      const subscriptionHash = await subscriptionSha(subscription)
      if (localStorage.getItem('subscriptionHash') === subscriptionHash) return
      try {
        await sendToServer(supabaseClient, userId, subscription)
      } catch (error) {
        if (typeof error !== 'string' || !error.includes('duplicate key')) throw error
      }
      localStorage.setItem('subscriptionHash', subscriptionHash)
    } else if (Notification.permission === 'granted') {
      const metadata = { user_agent: navigator.userAgent }
      await silentTrackEvent(supabaseClient, userId, 'notification-granted', metadata)
    }
  } catch {}
}
