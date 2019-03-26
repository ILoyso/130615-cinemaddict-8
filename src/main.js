import filtersData from './get-filters';
import generateFilms from './generate-films';
import Film from './film';
import FilmPopup from './film-popup';
import Filter from './filter';
import Statistic from './statistic';

const HIDDEN_CLASS = `visually-hidden`;
const MAX_NUMBER_OF_FILMS = 7;
const NUMBER_OF_TOP_FILMS = 2;

const body = document.querySelector(`body`);
const main = document.querySelector(`.main`);
const filmsWrapper = document.querySelector(`.films`);
const filtersContainer = document.querySelector(`.main-navigation__nav`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const statisticButton = document.querySelector(`.main-navigation__item--additional`);


/**
 * Function for generate array with films data
 * @param {Number} amount
 * @return {Object[]}
 */
const generateFilmsData = (amount) => generateFilms(amount);

const filmsData = generateFilmsData(MAX_NUMBER_OF_FILMS);
const topFilmsData = generateFilmsData(NUMBER_OF_TOP_FILMS);


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
      film.isGoingToWatch = !film.isGoingToWatch;
      filmComponent.update(film);
    };

    filmComponent.onAddToFavorite = () => {
      film.isFavorite = !film.isFavorite;
      filmComponent.update(film);
    };

    filmComponent.onMarkAsWatched = () => {
      film.isViewed = !film.isViewed;
      filmComponent.update(film);
    };

    filmComponent.onCommentsClick = () => {
      const filmPopupComponent = new FilmPopup(film);

      filmPopupComponent.onClose = (updatedFilm) => {
        filmComponent.update(Object.assign(film, updatedFilm));
        body.removeChild(filmPopupComponent.element);
        filmPopupComponent.unrender();
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
 * @param {Object} films
 * @param {String} filterName
 * @return {Object}
 */
const filterFilms = (films, filterName) => {
  let filteredFilms = films;

  switch (filterName) {
    case `all`:
      filteredFilms = films;
      break;
    case `watchlist`:
      filteredFilms = films.filter((it) => it.isGoingToWatch);
      break;
    case `history`:
      filteredFilms = films.filter((it) => it.isViewed);
      break;
    case `favorites`:
      filteredFilms = films.filter((it) => it.isFavorite);
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
 * Function for render filters
 * @param {Node} container
 * @param {Object} filters
 * @param {Object} films
 */
const renderFilters = (container, filters, films) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = () => {
      const filterName = filterComponent.filterId;
      const filteredFilms = filterFilms(films, filterName);
      filters = updateActiveFilter(filter, filters);
      filter.isActive = true;
      filterComponent.update(filter);

      renderFilms(filmsContainer, filteredFilms);
      renderFilters(container, filters, films);
    };

    fragment.appendChild(filterComponent.render());
  });

  container.appendChild(fragment);
};


/** Function for hide films and show statistic */
const showStatistic = () => {
  filmsWrapper.classList.add(HIDDEN_CLASS);
  const statisticComponent = new Statistic(filmsData);
  main.appendChild(statisticComponent.render());
};

renderFilms(filmsContainer, filmsData);
renderTopFilms(filmsTopContainers, topFilmsData);
renderFilters(filtersContainer, filtersData, filmsData);

statisticButton.addEventListener(`click`, showStatistic);
