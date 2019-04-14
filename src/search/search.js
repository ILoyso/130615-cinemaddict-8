import SearchView from './search-view';
import {renderFilms} from '../films/films';

const header = document.querySelector(`.header`);
const profileContainer = document.querySelector(`.header__profile`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);


/**
 * Function for searching film by title
 * @param {Object[]} films
 * @param {String} title
 * @return {Object[]}
 */
const searchFilm = (films, title) => films.filter((film) => film.filmInfo.title.toLowerCase().indexOf(title.toLowerCase()) !== -1);


/**
 * Function for rendering search
 * @param {Object[]} films
 */
export const renderSearch = (films) => {
  const search = new SearchView();

  search.onSearch = () => {
    const filteredFilms = searchFilm(films, search.input.value);

    renderFilms(filmsContainer, filteredFilms);
  };

  header.insertBefore(search.render(), profileContainer);
};
