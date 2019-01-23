console.log("start");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then((sw) => console.log("Registered")).catch(console.error);
    //navigator.serviceWorker.register("sw2.js").then((sw) => console.log("Registered")).catch(console.error); // This line will not create a new SW but rather update the previous one which is sw.js
}