console.log("start");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then((sw) => console.log("Registered")).catch(console.error);
}