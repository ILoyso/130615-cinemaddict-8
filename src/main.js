import {generateRandomNumber, renderTemplate} from './utils';
import makeFilter from './make-filter';
import filters from './get-filters';
import generateFilms from './generate-films';
import Film from './film';

const MAX_NUMBER_OF_FILMS = 7;
const NUMBER_OF_TOP_FILMS = 2;
const FILTER_ACTIVE_CLASS = `main-navigation__item--active`;

const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);


/**
 * Function for create filters template
 * @param {Object[]} filtersData
 * @return {String}
 */
const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    filtersTemplate += makeFilter(filter.name, generateRandomNumber(15, 1), filter.isActive, filter.isAdditional);
  }
  return filtersTemplate;
};


/**
 * Function for generate array with films data
 * @param {Number} amount
 * @return {Object[]}
 */
const generateFilmsData = (amount) => generateFilms(amount);


/**
 * Function for render films
 * @param {Node} dist
 * @param {Object[]} films
 */
const renderFilms = (dist, films) => {
  const fragment = document.createDocumentFragment();

  films.forEach((film) => {
    const filmComponent = new Film(film);

    fragment.appendChild(filmComponent.render());
  });

  dist.appendChild(fragment);
};


/**
 * Function for render top films
 * @param {NodeListOf} dists
 * @param {Object[]} films
 */
const renderTopFilms = (dists, films) => {
  dists.forEach((dist) => {
    renderFilms(dist, films);
  });
};


/**
 * Function for filter click action
 * @param {Event} evt
 */
const onFilterClick = (evt) => {
  const clickedTag = evt.target;
  if ((clickedTag.tagName.toLowerCase() === `a`) && (!clickedTag.classList.contains(FILTER_ACTIVE_CLASS))) {
    filmsContainer.innerHTML = ``;
    renderFilms(filmsContainer, generateFilmsData(generateRandomNumber(10, 1)));
    renderTopFilms(filmsTopContainers, generateFilmsData(generateRandomNumber(4, 1)));
  }
};


renderTemplate(filtersContainer, createFiltersTemplate(filters));
renderFilms(filmsContainer, generateFilmsData(MAX_NUMBER_OF_FILMS));
renderTopFilms(filmsTopContainers, generateFilmsData(NUMBER_OF_TOP_FILMS));

filtersContainer.addEventListener(`click`, onFilterClick);

