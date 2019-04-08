const CACHE_NAME = `MOVIES_V1.0`;

/**
 * Function for adding data to SW cache
 * @param {Event} evt
 * @param {Response} response
 */
const addToCache = (evt, response) => {
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(evt.request, response));
};


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
    fetch(evt.request)
      .then((response) => {
        addToCache(evt, response.clone());

        return response.clone();
      })
      .catch(() => {
        return caches.match(evt.request)
          .then((response) => {
            return response;
          })
          .catch((err) => {
            throw err;
          });
      }),
  );
});
