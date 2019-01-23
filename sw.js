const version = "v7";

self.addEventListener("install", (event) => {
    console.log("SW Installed at : ", new Date().toLocaleTimeString());
    event.waitUntil(caches.open(version).then((cache)=>{
        return cache.addAll([   // If even a single resource is not available then this promise will reject and no resource will be cached
            "/offline.html",
            "/scripts/offline.js",
            "/styles/offline.css",
            "/images/offline.jpeg"
        ])
    }))
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("SW Activated at : ", new Date().toLocaleTimeString());
    event.waitUntil(caches.keys().then((keys)=>{
        return Promise.all(keys.filter((key)=>{
            return key !== version;
        }).map((key)=>{
            return caches.delete(key);
        }))
    }));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((res)=>{
        if(res)
            return res;
        if(!navigator.onLine)
            return caches.match(new Request("offline.html"));
        return fetchAndUpdate(event.request);
    }))
    // if (!navigator.onLine) {
    //     event.respondWith(new Response("<img src='images/offline.jpeg' alt=''>", { headers: { "Content-type": "text/html" } }))
    // }
    // console.log(event.request.url);
    // event.respondWith(fetch(event.request));
})


function fetchAndUpdate(request){
    return fetch(request).then((res)=>{
        if(res){
            return caches.open(version).then((cache)=>{
                return cache.put(request,res.clone()).then(()=>{
                    return res;
                })
            })
        }
        else{
            return new Promise((resolve)=>{
                console.log(`could not load resource ${request.url}`)
                resolve();
            })
        }
    })
}