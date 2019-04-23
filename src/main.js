import API from './api';
import Provider from './provider';
import Store from './store';
import {renderFilters} from './filters/filters';
import {showLoader, hideLoader, renderUserRank, renderMaxMovieCount} from './utils/utils';
import {renderSearch} from './search/search';
import {showFilms, showTopFilms, showMostCommentedFilms} from './films/films';

const AUTHORIZATION = `Basic l76oy54048so9f866780k356`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const FILMS_STORE_KEY = `films-store-key`;

const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const loadingContainer = document.querySelector(`.films-list__title`);
const rankContainer = document.querySelector(`.profile__rating`);
const maxMovieContainer = document.querySelector(`.footer__statistics p`);


/**
 * Create new api for working with server
 * @type {API}
 */
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

/**
 * Create a store for working with localStorage
 * @type {Store}
 */
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});

/**
 * Create a Provider for synchronize working api and store
 * @type {Provider}
 */
export const provider = new Provider({api, store});


window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});


showLoader(loadingContainer);

provider.getFilms()
  .then((films) => {
    hideLoader(loadingContainer);
    renderSearch(films);
    showFilms(filmsContainer, films);
    showTopFilms(filmsTopContainers[0], films);
    showMostCommentedFilms(filmsTopContainers[1], films);
    renderFilters(films);
    renderUserRank(rankContainer, films);
    renderMaxMovieCount(maxMovieContainer, films);
  })
  .catch(() => {
    showLoader(`Something went wrong while loading movies. Check your connection or try again later`);
  });
