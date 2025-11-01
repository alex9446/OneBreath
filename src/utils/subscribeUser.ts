import { base64ToUint8Array } from './mixed'
import type { SupabaseClientDB } from './mixed.types'

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
  console.debug(subscription)
  console.debug(supabaseClient)
}

export const subscribeUser = async (supabaseClient: SupabaseClientDB) => {
  const subscription = await createSubscription()
  await sendToServer(subscription, supabaseClient)
}

export const unsubscribeUser = async () => (await getSubscription())?.unsubscribe()
