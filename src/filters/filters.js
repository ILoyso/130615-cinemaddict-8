import filtersData from './filters-data';
import FilterView from './filter-view';
import {hideStatistic, showStatistic} from '../statistic/statistic';
import {HIDDEN_CLASS} from '../utils/utils';
import {showFilms} from '../films/films';
import {clearSearch} from '../search/search';

const filmsWrapper = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filtersContainer = document.querySelector(`.main-navigation`);


/**
 * Function for filter films
 * @param {Object[]} films
 * @param {String} filterName
 * @return {Object[]}
 */
const filterFilms = (films, filterName) => {
  let filteredFilms = films;

  switch (filterName) {
    case `all movies`:
      filteredFilms = films;
      break;
    case `watchlist`:
      filteredFilms = films.filter((film) => film.userInfo.isGoingToWatch);
      break;
    case `history`:
      filteredFilms = films.filter((film) => film.userInfo.isViewed);
      break;
    case `favorites`:
      filteredFilms = films.filter((film) => film.userInfo.isFavorite);
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
 * @param {Object[]} films
 * @param {Object} filters [filters = filtersData]
 * @param {Node} container [container = filtersContainer]
 */
export const renderFilters = (films, filters = filtersData, container = filtersContainer) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new FilterView(filter);
    const filterName = filterComponent.filterId;
    const filteredFilms = filterFilms(films, filterName);

    filterComponent.onFilter = () => {
      clearSearch();
      filters = updateActiveFilter(filter, filters);
      filter.isActive = true;
      filterComponent.update(filter);

      if (filterName === `stats`) {
        showStatistic(films);
        filmsWrapper.classList.add(HIDDEN_CLASS);
      } else {
        filmsWrapper.classList.remove(HIDDEN_CLASS);
        hideStatistic();
        showFilms(filmsContainer, filteredFilms, true, true, true);
      }

      renderFilters(films);
    };

    fragment.appendChild(filterComponent.render());
    filterComponent.setFilterCount(filteredFilms.length);
  });

  container.appendChild(fragment);
};
