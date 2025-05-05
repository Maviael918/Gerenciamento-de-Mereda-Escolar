// Crie este arquivo na pasta static/js
const CACHE_NAME = 'merenda-escolar-v1';
const ASSETS = [
  '/',
  '/static/css/style.css',
  '/static/js/app.js',
  '/static/js/idb.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});