// GuildPost Service Worker
// Handles Web Push notifications and background sync

const CACHE_NAME = 'guildpost-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/logo.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    // If not JSON, use as text
    data = {
      title: 'GuildPost',
      body: event.data.text(),
      icon: '/logo.svg',
      badge: '/favicon.svg'
    };
  }

  const title = data.title || 'GuildPost';
  const options = {
    body: data.body || '',
    icon: data.icon || '/logo.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'guildpost-notification',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    silent: data.silent || false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let url = '/';

  // Determine URL based on notification type
  if (data.type === 'vote') {
    url = `/servers/${data.serverId}`;
  } else if (data.type === 'status_change') {
    url = `/servers/${data.serverId}`;
  } else if (data.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - network-first strategy for API calls, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // API calls - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((fetchResponse) => {
        // Cache successful responses
        if (fetchResponse.ok && fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return fetchResponse;
      });
    })
  );
});
