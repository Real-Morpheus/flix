const CACHE_NAME = 'sanchitflix-cache-v1';
const urlsToCache = [
  './index.html',
  '/',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
];

// Install event: caching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serving from cache if available, otherwise fetching from network
self.addEventListener('fetch', (event) => {
  // Only cache static assets and the main document. 
  // Do NOT cache API calls (DATA_API_URL or PROXY_URL) as they need to be live.
  const url = new URL(event.request.url);
  const isApi = url.origin === 'https://sanch1tx-flix.hf.space' || url.hostname.includes('allorigins.win');

  if (isApi) {
    // API calls go straight to the network
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
