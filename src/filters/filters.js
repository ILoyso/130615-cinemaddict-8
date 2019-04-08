import FilterView from './filter-view';
import {hideStatistic, showStatistic} from '../statistic/statistic';
import {HIDDEN_CLASS, checkLoadMoreButton} from '../utils/utils';
import {renderFilms} from '../films/films';

const filmsWrapper = document.querySelector(`.films`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const showMoreButton = document.querySelector(`.films-list__show-more`);


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
 * Function for render filters
 * @param {Node} container
 * @param {Object} filters
 * @param {Object[]} films
 */
export const renderFilters = (container, filters, films) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  filters.forEach((filter) => {
    const filterComponent = new FilterView(filter);

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

        checkLoadMoreButton(showMoreButton, filteredFilms);
        renderFilms(filmsContainer, filteredFilms);
      }

      renderFilters(container, filters, films);
    };

    fragment.appendChild(filterComponent.render());
  });

  container.appendChild(fragment);
};
