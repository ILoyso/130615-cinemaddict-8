const CACHE_NAME = `MOVIES_V1.0`;

/** Listener for installing SW cache and add to them all html, styles, images and scripts */
self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/`,
        `./images/`,
      ]);
    });

  evt.waitUntil(openCache);
});


/** Listener for working with SW cache */
self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error({err});
        throw err;
      })
  );
});
