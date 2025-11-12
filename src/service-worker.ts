/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

// self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('push', (event) => {
  if (!event.data) return
  const title = event.data.text()
  const options = {
    icon: '/icon.svg',
    actions: { action: 'open', title: 'Apri' }
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(self.clients.openWindow('/'))
})
