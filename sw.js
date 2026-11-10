/* Guarda la app en el teléfono para que abra sin conexión.
   Con internet siempre trae la versión nueva; sin internet usa la guardada. */
const CACHE = 'notas-de-voz-v7';
const ASSETS = ['./', 'index.html', 'styles.css', 'theme.js', 'app.js', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/monochrome-512.png',
  'fonts/league-spartan-latin-800-normal.woff2', 'fonts/courier-prime-latin-400-normal.woff2',
  'fonts/courier-prime-latin-700-normal.woff2', 'fonts/archivo-latin-wght-normal.woff2'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // 'no-cache' obliga a preguntarle al servidor si hay una versión nueva, en vez de usar
  // la copia que el navegador guarda por su cuenta: así una actualización llega enseguida.
  const fresh = req.mode === 'navigate' ? fetch(req.url, { cache: 'no-cache' }) : fetch(req, { cache: 'no-cache' });
  e.respondWith(
    fresh
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./')))
  );
});
