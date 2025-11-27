const CACHE_NAME = 'tokyo-trip-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  // 假設您在 images 資料夾中放置了圖標
  '/images/icon-192.png', 
  '/images/icon-512.png'
];

// 安裝服務工作線程：緩存所有核心檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截請求：如果離線，則從緩存中獲取內容
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果緩存中有，則直接返回
        if (response) {
          return response;
        }
        // 如果緩存中沒有，則嘗試從網路獲取
        return fetch(event.request);
      })
  );
});

// 清理舊的緩存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});