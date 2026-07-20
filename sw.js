const CACHE="just-enough-final-v1";
const FILES=[
"./","index.html","styles.css","app.js","manifest.webmanifest","icon.svg",
"spicy_chicken.jpg","oil_quarter.jpg","oil_half.jpg",
"noodles_small.jpg","noodles_large.jpg","oil_rice.jpg","hainan_rice.jpg"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
