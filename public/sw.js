const CACHE = 'tab-playbook-v1';
const PAGES = ['/', '/index.html', '/privacy/', '/terms/'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = new Set(['/manifest.webmanifest', '/assets/icon.svg']);
    for (const page of PAGES) {
      const response = await fetch(page);
      await cache.put(page, response.clone());
      const html = await response.text();
      for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) assets.add(match[1]);
    }
    await cache.addAll([...assets]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/index.html') : Response.error())));
});
