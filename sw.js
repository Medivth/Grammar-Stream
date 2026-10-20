// Service worker: precache everything so the app works fully offline after the first visit.
// GENERATED from tools/sw-template.js by tools/gen-precache.mjs — do not edit sw.js by hand.
const VERSION = 'ca7c3fb16b79';
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
 "./js/core/placement.js",
 "./js/core/practice.js",
 "./js/core/present.js",
 "./js/core/progress.js",
 "./js/core/pronoun.js",
 "./js/core/rng.js",
 "./js/core/session.js",
 "./js/core/sprint.js",
 "./js/core/store.js",
 "./js/core/subjects.js",
 "./js/core/writing.js",
 "./js/gen/english.js",
 "./js/gen/geography.js",
 "./js/gen/history.js",
 "./js/gen/index.js",
 "./js/gen/ks1maths.js",
 "./js/gen/ks1maths2.js",
 "./js/gen/maths.js",
 "./js/gen/maths2.js",
 "./js/gen/maths3.js",
 "./js/gen/paper.js",
 "./js/gen/science.js",
 "./js/gen/science2.js",
 "./js/gen/sprint.js",
 "./js/gen/synoptic.js",
 "./js/main.js",
 "./js/platform/storage.js",
 "./js/platform/tts.js",
 "./js/screens/home.js",
 "./js/screens/onboarding.js",
 "./js/screens/paper.js",
 "./js/screens/parent.js",
 "./js/screens/play.js",
 "./js/screens/progress.js",
 "./js/screens/reading.js",
 "./js/screens/speed.js",
 "./js/screens/typing.js",
 "./js/screens/util.js",
 "./js/screens/writing.js",
 "./js/ui/capybara.js",
 "./js/ui/diagrams.js",
 "./js/ui/dom.js",
 "./js/ui/icons.js",
 "./js/ui/mapview.js",
 "./js/ui/qtypes.js",
 "./content/english/morphology.json",
 "./content/english/reading-writing.json",
 "./content/english/reading.json",
 "./content/english/spelling.json",
 "./content/english/stretch.json",
 "./content/english/vocabulary.json",
 "./content/english/writing.json",
 "./content/english/year7.json",
 "./content/geography/by-numbers.json",
 "./content/geography/core.json",
 "./content/geography/stretch.json",
 "./content/geography/year7.json",
 "./content/history/core.json",
 "./content/history/joined-up.json",
 "./content/history/stretch.json",
 "./content/history/timeline.json",
 "./content/history/year7.json",
 "./content/index-ks1.json",
 "./content/index.json",
 "./content/ks1/history/core.json",
 "./content/ks1/history/more.json",
 "./content/ks1/history/timeline.json",
 "./content/ks1/maths/core.json",
 "./content/ks1/maths/more.json",
 "./content/ks1/reading/books.json",
 "./content/ks1/reading/core.json",
 "./content/ks1/reading/more.json",
 "./content/ks1/science/core.json",
 "./content/ks1/science/more.json",
 "./content/ks1/spelling/core.json",
 "./content/ks1/spelling/more.json",
 "./content/latin/core.json",
 "./content/maps/cell-animal.json",
 "./content/maps/cell-plant.json",
 "./content/maps/europe.json",
 "./content/maps/flower.json",
 "./content/maps/particles.json",
 "./content/maps/uk.json",
 "./content/maps/world.json",
 "./content/maths/averages.json",
 "./content/maths/core.json",
 "./content/maths/stretch.json",
 "./content/science/core.json",
 "./content/science/joined-up.json",
 "./content/science/stretch.json",
 "./content/science/year7.json",
 "./fonts/atkinson-hyperlegible-latin-400-normal.woff2",
 "./fonts/atkinson-hyperlegible-latin-700-normal.woff2",
 "./fonts/opendyslexic-latin-400-normal.woff2",
 "./fonts/opendyslexic-latin-700-normal.woff2",
 "./fonts/outfit-latin-600-normal.woff2",
 "./fonts/outfit-latin-800-normal.woff2",
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
