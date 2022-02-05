self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('sw-cache').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/favicon.ico',
                '/sw.js',
                '/css/main.css',
                '/img/sinuk.svg',
                '/img/sinuk.png',
                '/js/main.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response ?? fetch(event.request);
        })
    );
});
