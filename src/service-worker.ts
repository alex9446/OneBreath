/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import type { NotificationPayload } from './utils/generic.types'

const DEFAULT_ICON = '/images/icon.svg'
const DEFAULT_BADGE = '/images/badge.png'
const DEFAULT_URL = '/'

const parsePushData = (data: PushMessageData): NotificationPayload => {
  try { return data.json() } catch { return { title: data.text() } }
}

const focusOrOpen = async (url: string) => {
  const absoluteUrl = new URL(url, self.location.origin).href

  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  for (const client of windowClients) {
    if (client.url === absoluteUrl && 'focus' in client) {
      return client.focus()
    }
  }

  return self.clients.openWindow(absoluteUrl)
}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('push', (event) => {
  if (!event.data) return

  const payload = parsePushData(event.data)
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon ?? DEFAULT_ICON,
    badge: payload.badge ?? DEFAULT_BADGE,
    tag: payload.tag,
    requireInteraction: payload.requireInteraction ?? false,
    data: { url: payload.url ?? DEFAULT_URL },
  }

  event.waitUntil(self.registration.showNotification(payload.title ?? 'Title error', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(focusOrOpen(event.notification.data?.url ?? DEFAULT_URL))
})
