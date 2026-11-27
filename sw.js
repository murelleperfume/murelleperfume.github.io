const CACHE = 'murelle-v3';
const SHELL = ['/', '/index.html', '/order.html', '/assets/theme.css', '/img/logo.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => fetch(u, {cache: 'reload'}).then(r => r.ok ? c.put(u, r) : null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // network first (bypass HTTP cache), fall back to cache when offline
  e.respondWith(
    fetch(req, {cache: 'no-cache'}).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
  );
});
