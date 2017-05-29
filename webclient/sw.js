let CACHE_NAME = 'order-splitter-cache-%%GULP_INJECT_VERSION%%';
let urlsToCache = [
    'index.html', 
    'index.js'
].map(f => './'+f);

self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
    let cacheWhiteList = [CACHE_NAME];
    event.waitUntil(
    caches.keys().then(function(keyList) {
        return Promise.all(
        keyList.filter(function(key) {
            return cacheWhiteList.indexOf(key) === -1;
        }).map(function(key) {
            return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
        if (response) {
            return response;
        }
        return fetch(event.request);
    })
  );
});
