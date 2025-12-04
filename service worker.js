self.addEventListener('install', e=>{
  self.skipWaiting();
});
self.addEventListener('fetch', e=>{
  // simple network-first strategy for demo
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
