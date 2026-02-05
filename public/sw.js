const CACHE_NAME = 'baseline-video-cache-v1';
const BASELINE_VIDEO_PATTERN = /\/baseline\/.*\.mp4$/;

// Install event - setup cache
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('baseline-video-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache strategy for baseline videos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle baseline video requests
  if (BASELINE_VIDEO_PATTERN.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', url.pathname);
            return cachedResponse;
          }
          
          console.log('[Service Worker] Fetching and caching:', url.pathname);
          return fetch(event.request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
  // For all other requests, just fetch normally
});
