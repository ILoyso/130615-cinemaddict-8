import {generateRandomNumber, renderTemplate} from './utils';
import makeFilter from './make-filter';
import filters from './get-filters';
import generateFilms from './generate-films';

const MAX_NUMBER_OF_FILMS = 7;
const NUMBER_OF_TOP_FILMS = 2;
const FILTER_ACTIVE_CLASS = `main-navigation__item--active`;

const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);

const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    filtersTemplate += makeFilter(filter.name, generateRandomNumber(15, 1), filter.isActive, filter.isAdditional);
  }
  return filtersTemplate;
};

const renderTopFilms = (amount) => {
  filmsTopContainers.forEach((container) => {
    container.innerHTML = ``;
    renderTemplate(container, generateFilms(amount, false).join(``));
  });
};

const onFilterClick = (evt) => {
  const clickedTag = evt.target;
  if ((clickedTag.tagName.toLowerCase() === `a`) && (!clickedTag.classList.contains(FILTER_ACTIVE_CLASS))) {
    filmsContainer.innerHTML = ``;
    renderTemplate(filmsContainer, generateFilms(generateRandomNumber(15, 1)).join(``));
    renderTopFilms(generateRandomNumber(5, 1));
  }
};

filtersContainer.addEventListener(`click`, onFilterClick);

renderTemplate(filtersContainer, createFiltersTemplate(filters));
renderTemplate(filmsContainer, generateFilms(MAX_NUMBER_OF_FILMS));
renderTopFilms(NUMBER_OF_TOP_FILMS);
