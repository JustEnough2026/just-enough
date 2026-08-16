const CACHE="just-enough-v34";
const FILES=[
"./","index.html","styles.css","app.js","manifest.webmanifest","icon.svg",
"baqi_chicken_noodles.jpg?v=33","spicy_chicken.jpg?v=33","oil_quarter.jpg?v=33","oil_half.jpg?v=33",
"noodles_small.jpg?v=33","noodles_large.jpg?v=33","oil_rice.jpg?v=33","hainan_rice.jpg?v=33"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
