# Service Workers

A step by step guide to create service workers

## Introduction

A service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction. Today, they already include features like push notifications and background sync. In the future, service workers might support other things like periodic sync or geofencing. The core feature discussed in this tutorial is the ability to intercept and handle network requests, including programmatically managing a cache of responses.

### Why Offline Matters

There may be a lot of scenarios when you don't have the access to the internet but you still want to be able to surf the net or just get some information about certain product. This is the time when your application should behave smartly and behave in a manner that the user gets a seamless experience of the your site. Some of such scenarious can be :

1. While you are traveling
2. When you are in a crowded place.
3. When you are inside and the network is an issue.

Note : Please have a look at [this](http://offlinefirst.org/) page to get an idea about the importance of **offlinefirst**.

### AppCache Cons

**Cons**
1. Content will always come from App cache even if you are online.
2. The App cache only updates if the content of the manifest itself has changed. Event though the resource has updated but till the time the manifest is updated the new resource will not be fetched from the server.
3. App cache is build on to of browser cache.
4. Never ever far future cache the manifest file.

### How Workers Work

Please go through [this](https://github.com/ashishtayal89/learnwebworkers) document to get an idea about how dediated and shared workers work.

### How Service Workers Work

Service workers work on the principle of progressive enhancement. They act as a middleware between the browser and the server. Any request which a browser sends to the server goes through the service worker.

<img width="1257" alt="screenshot 2019-01-22 at 1 30 52 pm" src="https://user-images.githubusercontent.com/46783722/51520576-1463aa80-1e4a-11e9-817b-2f4236c1ae6c.png">

**Note** : We can't have more than 1 service worker for 1 domain/web app. The new service worker replaces the old one and is there in the waiting state till the application is reloaded.

## Lifecycle

Service workers are more like shared workers since they are shared accross different pages/tabs and are not specific to a page. Since it not tied to specific page so it doesn't have access to a perticular pages DOM. It has its own thread/process. But unlike shared worker, service workers can run without any page at all.

There are 3 major steps in the service worker lifecycle :
1. Registration
2. Installation
3. Use

### 1.Registration
 
This step tells the browser about the service worker.
You can register your service worker as below :
1. ```javascript
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").then((sw) => console.log("Registered")).catch(console.error);
    }
    ```

2. ```javascript
    <link rel="serviceworker" href="script/sw.js" scope="/brand">
    ```

#### Scope
Scope tell the limit/access-level of a service worker. If a service worker is present in a folder name `script\sw.js` then is scope will be limited till this folder only. If you need to overwride this scope then you need to specify that in the  `Service-Worker-Allowed : /` response header of service worker. Request for the sw.js file contains an additional header `Service-Worker : script` which tell the server that this a service worker request. One can also restict the sevice worker to a specific folder by providing an additional scope property while registring it like below.

```javascript
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js",{scope:"/brand"}).then((sw) => console.log("Registered")).catch(console.error);
}
```

Scope of a service worker
<img width="1324" alt="screenshot 2019-01-21 at 10 02 05 pm" src="https://user-images.githubusercontent.com/46783722/51520580-162d6e00-1e4a-11e9-95aa-8a1527765192.png">

### 2.Installation

#### Initial Instalation

1. In this initial there is not service worker configured.
2. First the `install` event of sw is fired which changes its state to `installing`. The `event.waitUntil` function accepts a promise which will wait until the promise resolves or rejects. If it resolves then the activate event is fired. Otherwise sw moves to error state.
3. Then the `activate` event of sw is fired which move it to the `activated` state. There is a similar `event.waitUntil` function here.
4. Now the sw is ready for use.
<img width="1034" alt="screenshot 2019-01-22 at 3 49 09 pm" src="https://user-images.githubusercontent.com/46783722/51529081-0fa8f180-1e5e-11e9-9f28-4ff89d9dac45.png">

#### Update Instalation

1. In this initial there is already a active service worker configured.
2. First the `install` event of new sw is fired which changes its state to `installing`. The `event.waitUntil` function accepts a promise which will wait until the promise resolves or rejects. If it resolves then the activate event is fired. Otherwise sw moves to error state.
3. After `installing` state the new sw moves to the `waiting` state since the is already an old sw under operation. The browser can allow half the page to be served by 1 sw and the rest by another. If we want to explicity move ahead and fire the activate event then we must call `event.skipWaiting` function from insite the install event handler.
3. Then the `activate` event of sw is fired which move it to the `activated` state. There is a similar `event.waitUntil` function here.
4. Now the sw is ready for use.
<img width="1039" alt="screenshot 2019-01-22 at 3 51 26 pm" src="https://user-images.githubusercontent.com/46783722/51529086-10da1e80-1e5e-11e9-9f59-fb1e2be7f2f8.png">

This step intall the worker and updates its state to active so that it can be ready for use.

### 3.Useing

This is the step in which we use the service worker for fetching different resources for us.

1. Once `activated` the sw moves to the `idle` state.
2. Once it gets a network request it fires a `fetch` event and moves to the `fetch` state and goes back to the `idle` state after that. It keeps on osilating between the `fetch` and `idle` state.
3. If it is `idle` for to long the browser moves it the `termiated` state to save the resouces.
4. If it again gets a fetch request it goes to `idle` state and then to `fetch` state.

<img width="1295" alt="screenshot 2019-01-22 at 4 05 57 pm" src="https://user-images.githubusercontent.com/46783722/51529855-a0cc9800-1e5f-11e9-88de-a3c05a25bdad.png">

## Caching
