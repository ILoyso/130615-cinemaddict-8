import filtersData from './get-filters';
import Film from './film';
import FilmPopup from './film-popup';
import Filter from './filter';
import Statistic from './statistic';
import API from './api';

const HIDDEN_CLASS = `visually-hidden`;

const body = document.querySelector(`body`);
const main = document.querySelector(`.main`);
const filmsWrapper = document.querySelector(`.films`);
const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const showMoreButton = document.querySelector(`.films-list__show-more`);
const loadingContainer = document.querySelector(`.films-list__title`);

const AUTHORIZATION = `Basic l76oy54048so925dfdfd0`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;


/**
 * Create new api for working with server
 * @type {API}
 */
const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});


/**
 * Function for render films
 * @param {Node} container
 * @param {Object[]} films
 */
const renderFilms = (container, films) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  films.forEach((film) => {
    const filmComponent = new Film(film);

    filmComponent.onAddToWatchList = () => {
      film.userInfo.isGoingToWatch = !film.userInfo.isGoingToWatch;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmComponent.update(newFilm);
        });
    };

    filmComponent.onAddToFavorite = () => {
      film.userInfo.isFavorite = !film.userInfo.isFavorite;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmComponent.update(newFilm);
        });
    };

    filmComponent.onMarkAsWatched = () => {
      film.userInfo.isViewed = !film.userInfo.isViewed;

      api.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmComponent.update(newFilm);
        });
    };

    filmComponent.onCommentsClick = () => {
      const filmPopupComponent = new FilmPopup(film);

      filmPopupComponent.onComment = (newComment) => {
        film.comments.push(newComment);

        api.updateFilm({id: film.id, data: film.toRAW()})
          .then((newFilm) => {
            filmPopupComponent.unblockComments();
            filmPopupComponent.updateComments(newFilm);
          })
          .catch(() => {
            filmPopupComponent.shake();
            filmPopupComponent.errorComments();
          });
      };

      filmPopupComponent.onRatingClick = (newRating) => {
        film.userInfo.rating = newRating;

        api.updateFilm({id: film.id, data: film.toRAW()})
          .then((newFilm) => {
            filmPopupComponent.unblockRating();
            filmPopupComponent.updateRating(newFilm);
          })
          .catch(() => {
            filmPopupComponent.shake();
            filmPopupComponent.errorRating();
          });
      };

      filmPopupComponent.onClose = (updatedFilm) => {
        film = Object.assign(film, updatedFilm);

        api.updateFilm({id: film.id, data: film.toRAW()})
          .then((newFilm) => {
            filmComponent.update(newFilm);
            body.removeChild(filmPopupComponent.element);
            filmPopupComponent.unrender();
          })
          .catch(() => {
            filmPopupComponent.shake();
          });
      };

      filmPopupComponent.render();
      body.appendChild(filmPopupComponent.element);
    };

    fragment.appendChild(filmComponent.render());
  });

  container.appendChild(fragment);
};


/**
 * Function for render top films
 * @param {NodeListOf} containers
 * @param {Object[]} films
 */
const renderTopFilms = (containers, films) => {
  containers.forEach((container) => {
    renderFilms(container, films);
  });
};


/**
 * Function for filter films
 * @param {Object[]} films
 * @param {String} filterName
 * @return {Object[]}
 */
const filterFilms = (films, filterName) => {
  let filteredFilms = films;

  switch (filterName) {
    case `all`:
      filteredFilms = films;
      break;
    case `watchlist`:
      filteredFilms = films.filter((it) => it.userInfo.isGoingToWatch);
      break;
    case `history`:
      filteredFilms = films.filter((it) => it.userInfo.isViewed);
      break;
    case `favorites`:
      filteredFilms = films.filter((it) => it.userInfo.isFavorite);
      break;
  }

  return filteredFilms;
};


/**
 * Function for update active filter
 * @param {Object} activeFilter
 * @param {Object[]} filters
 * @return {Object[]}
 */
const updateActiveFilter = (activeFilter, filters) => {
  for (const filter of filters) {
    if (filter.isActive) {
      filter.isActive = false;
      break;
    }
  }
  activeFilter.isActive = true;
  return filters;
};


/**
 * Function for check should 'Show more' button be visible or no
 * @param {Object[]} films
 */
const checkLoadMoreButton = (films) => {
  if (films.length === 0) {
    showMoreButton.classList.add(HIDDEN_CLASS);
  } else {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  }
};


/**
 * Function for render filters
 * @param {Node} container
 * @param {Object} filters
 * @param {Object[]} films
 */
const renderFilters = (container, filters, films) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.filterId;

      filters = updateActiveFilter(filter, filters);
      filter.isActive = true;
      filterComponent.update(filter);

      if (filterName === `stats`) {
        showStatistic(films);
        filmsWrapper.classList.add(HIDDEN_CLASS);
      } else {
        filmsWrapper.classList.remove(HIDDEN_CLASS);
        hideStatistic();

        const filteredFilms = filterFilms(films, filterName);

        checkLoadMoreButton(filteredFilms);
        renderFilms(filmsContainer, filteredFilms);
      }

      renderFilters(container, filters, films);
    };

    fragment.appendChild(filterComponent.render());
  });

  container.appendChild(fragment);
};


/**
 * Function for show statistic
 * @param {Object[]} films
 */
const showStatistic = (films) => {
  const statisticComponent = new Statistic(films);
  main.appendChild(statisticComponent.render());
};


/** Function for hide statistic */
const hideStatistic = () => {
  if (document.querySelector(`.statistic`)) {
    main.removeChild(document.querySelector(`.statistic`));
  }
};


/**
 * Function for show loader
 * @param {String} text
 */
const showLoader = (text = `Loading movies...`) => {
  loadingContainer.textContent = text;
  loadingContainer.classList.remove(HIDDEN_CLASS);
};


/** Function for hide loader */
const hideLoader = () => {
  loadingContainer.textContent = `Loading movies...`;
  loadingContainer.classList.add(HIDDEN_CLASS);
};


showLoader();

api.getFilms()
  .then((films) => {
    hideLoader();
    renderFilms(filmsContainer, films);
    renderTopFilms(filmsTopContainers, films);
    renderFilters(filtersContainer, filtersData, films);
  })
  .catch(() => {
    showLoader(`Something went wrong while loading movies. Check your connection or try again later`);
  });
