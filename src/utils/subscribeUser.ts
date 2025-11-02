import { base64ToUint8Array } from './mixed'
import type { SupabaseClientDB } from './mixed.types'

const getUserId = async (supabaseClient: SupabaseClientDB) => {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  if (error) throw error.message
  if (!session) throw 'session is null'
  return session.user.id
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
