const staticCacheName = 'site-static-v11';
const assets = [
	'./',
	'./index.html',
	'./pages/offline.html',
	'./js/app.js',
	'./css/main.css',
	'./img/fresh-bg.jpg',
	'./img/darkmode-bg.jpg',
	'./img/twinkling.png',
	'./img/darkmode-space.png',
	'./img/default-bg.jpg',
	'https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap',
	'https://fonts.gstatic.com/s/bebasneue/v1/JTUSjIg69CK48gW7PXoo9WdhyyTh89ZNpQ.woff2',
	'https://fonts.gstatic.com/s/bebasneue/v1/JTUSjIg69CK48gW7PXoo9WlhyyTh89Y.woff2',
	'https://kit.fontawesome.com/e9068dbb85.js',
];

// cache size limit function
const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if(keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			}
		})
	})
};

// install service worker
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(staticCacheName).then(cache => {
			cache.addAll(assets);
		})
	);
});

// activate service worker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			)
		})
	);
});

// fetch event
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
			return cacheRes || fetch(evt.request);
		})
	);
});