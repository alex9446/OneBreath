/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

type NotificationData = {
  url: string
}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('push', (event) => {
  if (!event.data) return
  let title = event.data.text()
  let url = '/'
  try {
    const dataJson = event.data.json()
    title = dataJson.title ?? title
    url = dataJson.url ?? url
  } catch (error) { console.warn('PushMessageData is not json', error) }

  const options: NotificationOptions = {
    icon: '/icon.svg',
    data: { url } as NotificationData
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  let url = '/'
  try {
    ({ url } = event.notification.data as NotificationData)
  } catch (error) { console.error(error) }

  event.notification.close()
  event.waitUntil(self.clients.openWindow(url))
})
