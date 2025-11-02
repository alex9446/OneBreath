/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

// self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('push', (event) => {
  if (!event.data) return
  const title = event.data.text()
  const options: NotificationOptions = {
    icon: '/icon.svg'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
