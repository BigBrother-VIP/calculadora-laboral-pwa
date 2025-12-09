// Nombre de la versión de caché (cambia el número si haces una actualización grande)
const CACHE_VERSION = 'calculadora-lft-v1';
const CACHE_NAME = CACHE_VERSION;

// Archivos esenciales para que la PWA funcione sin conexión
const URLS_TO_CACHE = [
  './', // Ruta raíz (importante)
  './index.html', // Tu archivo principal
  './manifest.json', 
  './calculator-icon-192.png', 
  /* Agrega aquí la URL de tu icono de 512x512 si lo creas */
  // Si usas un archivo CSS local, agrégalo: './styles.css'
  // Si usas un script JS local, agrégalo: './main.js' 
  // Nota: Tailwind y la fuente Inter se cargan desde CDN, no son cacheables directamente aquí.
];

// 1. Instalación del Service Worker: Guardar archivos esenciales
self.addEventListener('install', event => {
  // Esperar hasta que se complete la caché
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierta y archivos agregados');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Service Worker: Fallo al agregar archivos a caché', err);
      })
  );
});

// 2. Activación del Service Worker: Eliminar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('calculadora-lft-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName); // Eliminar cachés antiguas
        })
      );
    })
  );
});

// 3. Estrategia de Red-Primero con Fallback a Caché (para la mayoría de peticiones)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request) // Intentar obtener de la red primero
      .catch(() => {
        // Si falla la red, buscar en la caché
        return caches.match(event.request);
      })
  );

});
