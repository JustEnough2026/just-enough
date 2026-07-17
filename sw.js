const CACHE="just-enough-v31";
const FILES=[
"./","index.html","styles.css","app.js","manifest.webmanifest","icon.svg",
"spicy_chicken.jpg?v=31","oil_quarter.jpg?v=31","oil_half.jpg?v=31",
"noodles_small.jpg?v=31","noodles_large.jpg?v=31","oil_rice.jpg?v=31","hainan_rice.jpg?v=31"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
