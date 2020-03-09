const staticCacheName = "static-cache-v1";
const dynamicCacheName = "dynamic-cache-v1";
const assets = [
    "/",
    "/css/style.css",
    "/img/src_SDS.png",
    "/js/app.js",
    "/index.html",
    "/pages/error.html"
];

//Install Event New
self.addEventListener("install", event => {
    console.log("Service Worker installed", event);
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("Caching Assets");
            cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker Activated", event);
    // Activate Event
    event.waitUntil(
        caches
            .keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (
                            key !== staticCacheName &&
                            key !== dynamicCacheName
                        ) {
                            return caches.delete(key);
                        }
                    })
                );
            })
            .catch(err => {
                console.log(err);
            })
    );
});

self.addEventListener("fetch", event => {
    //Step 1
    /*event.respondWith(
        caches.match(event.request).then(res => {
            return res || fetch(event.request);
        })
    );*/

    //Step 2 (Dynamic Caching)
    /*event.respondWith(
        caches.match(event.request).then(res => {
            return (
                res ||
                fetch(event.request).then(fetchRes => {
                    const fetchClone = fetchRes.clone();
                    caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchClone);
                    });
                    return fetchRes;
                })
            );
        })
    );*/

    //Step 3(Error page)
    event.respondWith(
        caches
            .match(event.request)
            .then(res => {
                return (
                    res ||
                    fetch(event.request).then(fetchRes => {
                        const fetchClone = fetchRes.clone();
                        caches.open(dynamicCacheName).then(cache => {
                            cache.put(event.request.url, fetchClone);
                        });
                        return fetchRes;
                    })
                );
            })
            .catch(err => {
                if (event.request.url.indexOf(".html") > -1) {
                    return caches.match("/pages/error.html");
                }
            })
    );
});
