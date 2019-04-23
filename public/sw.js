const CACHE_NAME = `MOVIES_V1.0`;

/** Listener for installing SW cache and add to them all html, styles, images and scripts */
self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/normalize.css`,
        `./css/main.css`,
        `./images/posters/accused.jpg`,
        `./images/posters/blackmail.jpg`,
        `./images/posters/blue-blazes.jpg`,
        `./images/posters/fuga-da-new-york.jpg`,
        `./images/posters/moonrise.jpg`,
        `./images/posters/three-friends.jpg`,
        `./images/background.png`,
        `./images/icon-favorite.png`,
        `./images/icon-favorite.svg`,
        `./images/icon-watched.png`,
        `./images/icon-watched.svg`,
        `./images/icon-watchlist.png`,
        `./images/icon-watchlist.svg`
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
      .catch((error) => {
        console.error({error});
        throw error;
      })
  );
});
