// Evalúapp · service worker. Al publicar cambios, sube el número de CACHE.
const CACHE = 'evaluapp-10';
const SHELL = ['./', 'index.html', 'styles.css', 'curriculo.js', 'cabeceras.js', 'app.js', 'fonts/amatic-sc-700.woff2', 'fonts/bangers-400.woff2', 'manifest.webmanifest', 'icons/logo.png', 'icons/mark.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Red primero para la app (así siempre llega la última versión) y caché si no hay conexión.
// Las peticiones a Google (hoja y fuentes) no se tocan.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});
