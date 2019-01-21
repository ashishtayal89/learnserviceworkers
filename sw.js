self.addEventListener("install", () => {
    console.log("SW Installed at : ", new Date().toLocaleTimeString());
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    console.log("SW Activated at : ", new Date().toLocaleTimeString());
});

self.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        event.respondWith(new Response("<img src='images/offline.jpeg' alt=''>", { headers: { "Content-type": "text/html" } }))
    }
    console.log(event.request.url);
    event.respondWith(fetch(event.request));
})