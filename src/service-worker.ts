/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

// self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('push', (event) => {
  const title = 'Eri presente in piscina? Segna la presenza!'
  const options: NotificationOptions = {
    icon: '/icon.svg'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
