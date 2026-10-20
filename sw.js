// Service worker: precache everything so the app works fully offline after the first visit.
// GENERATED from tools/sw-template.js by tools/gen-precache.mjs — do not edit sw.js by hand.
const VERSION = '24792f5020b1';
const FILES = [
 "./",
 "./index.html",
 "./manifest.webmanifest",
 "./css/app.css",
 "./js/core/checkers.js",
 "./js/core/content.js",
 "./js/core/dates.js",
 "./js/core/elo.js",
 "./js/core/fraction.js",
 "./js/core/fsrs.js",
 "./js/core/mastery.js",
 "./js/core/present.js",
 "./js/core/rng.js",
 "./js/core/session.js",
 "./js/core/store.js",
 "./js/core/subjects.js",
 "./js/gen/history.js",
 "./js/gen/index.js",
 "./js/gen/maths.js",
 "./js/main.js",
 "./js/platform/storage.js",
 "./js/platform/tts.js",
 "./js/screens/home.js",
 "./js/screens/onboarding.js",
 "./js/screens/parent.js",
 "./js/screens/play.js",
 "./js/screens/util.js",
 "./js/ui/capybara.js",
 "./js/ui/dom.js",
 "./js/ui/mapview.js",
 "./js/ui/qtypes.js",
 "./content/english/morphology.json",
 "./content/english/spelling.json",
 "./content/english/vocabulary.json",
 "./content/english/writing.json",
 "./content/geography/core.json",
 "./content/history/core.json",
 "./content/index.json",
 "./content/maps/europe.json",
 "./content/maps/uk.json",
 "./content/maps/world.json",
 "./content/maths/core.json",
 "./content/science/core.json",
 "./fonts/atkinson-hyperlegible-latin-400-normal.woff2",
 "./fonts/atkinson-hyperlegible-latin-700-normal.woff2",
 "./fonts/opendyslexic-latin-400-normal.woff2",
 "./fonts/opendyslexic-latin-700-normal.woff2",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-maskable-512.png",
 "./icons/icon.svg"
];
const CACHE = `grammar-stream-${VERSION}`;

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
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
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
