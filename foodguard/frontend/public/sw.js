self.addEventListener('push', (event) => {
  const payload = event.data?.json?.() || {}
  const title = payload.title || 'FoodGuard'
  const options = {
    body: payload.message || 'A reminder requires your attention.',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: payload.tag || 'foodguard-reminder',
    data: {
      url: payload.url || '/expiry-tracker',
    },
    requireInteraction: true,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification?.data?.url || '/expiry-tracker'
  const targetUrl = new URL(url, self.location.origin).toString()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0]
        client.focus()
        return client.postMessage({ type: 'notification-click', url: targetUrl })
      }

      return clients.openWindow(targetUrl)
    })
  )
})
