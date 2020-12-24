self.importScripts('./data/games.js');

// 对app shell和主体内容（content）里面的数据创建一个缓存列表
const cacheName = 'js13kPWA-v2';
const appShellFiles = [
    '/pwa-examples/',
    '/pwa-examples/index.html',
    '/pwa-examples/app.js',
    '/pwa-examples/style.css',
    '/pwa-examples/fonts/graduate.eot',
    '/pwa-examples/fonts/graduate.ttf',
    '/pwa-examples/fonts/graduate.woff',
    '/pwa-examples/favicon.ico',
    '/pwa-examples/img/js13kgames.png',
    '/pwa-examples/img/bg.png',
    '/pwa-examples/icons/icon-32.png',
    '/pwa-examples/icons/icon-64.png',
    '/pwa-examples/icons/icon-96.png',
    '/pwa-examples/icons/icon-128.png',
    '/pwa-examples/icons/icon-168.png',
    '/pwa-examples/icons/icon-192.png',
    '/pwa-examples/icons/icon-256.png',
    '/pwa-examples/icons/icon-512.png'
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
    gamesImages.push('img/' + games[i].slug + '.jpg');
}
const contentToCache = appShellFiles.concat(gamesImages);

// 配置service worker，缓存上述列表的工作就在这里发生
self.addEventListener('install', e => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })()

        // caches.open(cacheName).then(function(cache) {
        //     console.log('[Service Worker] Caching all: app shell and content');
        //     return cache.addAll(contentToCache);
        // })
    );
});

// 如果条件允许，service worker 将从缓存中请求 content 中所需的数据，从而提供离线应用功能
self.addEventListener('fetch', e =>
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || (async () => {
                const response = await fetch(e.request);
                const cache = await caches.open(cacheName);
                console.log('[Service Worker] Caching new resource: ' + e.request.url);
                await cache.put(e.request, response.clone());
                return response;
            })();
        })()

        // caches.match(e.request).then(function(r) {
        //     console.log('[Service Worker] Fetching resource: '+e.request.url);
        //     return r || fetch(e.request).then(function(response) {
        //         return caches.open(cacheName).then(function(cache) {
        //             console.log('[Service Worker] Caching new resource: '+e.request.url);
        //             cache.put(e.request, response.clone());
        //             return response;
        //         });
        //     });
        // })
    )
);

self.addEventListener('activate', e => {
    e.waitUntil(
        (async () => {
            const keyList = await caches.keys();
            return Promise.all(keyList.map(key => {
                if (cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })()

        // caches.keys().then(keyList => {
        //     return Promise.all(keyList.map(key => {
        //         if(cacheName.indexOf(key) === -1) {
        //             return caches.delete(key);
        //         }
        //     }));
        // })
    );
});