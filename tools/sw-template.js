// Service worker: precache everything so the app works fully offline after the first visit.
// GENERATED from tools/sw-template.js by tools/gen-precache.mjs — do not edit sw.js by hand.
const VERSION = '__VERSION__';
const FILES = __FILES__;
const CACHE = `grammar-stream-${VERSION}`;
// Library books (library/<id>.json, all but the precached index) are big, so each is cached the
// first time it is opened, in a cache that survives app updates. Served from the cache at once,
// and refreshed in the background when online.
const LIBRARY = 'gs-library-v1';
const isBook = (url) => /\/library\/(?!index\.json$)[^/]+\.json$/.test(url.pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('grammar-stream-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (isBook(url)) {
    event.respondWith(
      caches.open(LIBRARY).then(async (cache) => {
        const hit = await cache.match(req, { ignoreSearch: true });
        const fresh = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; });
        if (hit) { event.waitUntil(fresh.catch(() => {})); return hit; }
        return fresh;
      }),
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        if (req.mode === 'navigate') return cache.match('./index.html');
        throw e;
      }
    }),
  );
});
