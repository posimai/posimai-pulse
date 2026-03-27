const CACHE = 'posimai-pulse-v3';
const STATIC = ['/', '/index.html', '/manifest.json', '/logo.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()).catch(err => console.warn('[SW] activate error', err))); });
const ORIGIN = self.location.origin;
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    if (!e.request.url.startsWith(ORIGIN)) return;
    e.respondWith(caches.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; }).catch(() => cached);
        return cached || fresh;
    }));
});
