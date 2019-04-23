import FilmView from './film-view';
import FilmPopupView from './film-popup-view';
import {renderFilters} from '../filters/filters';
import {provider} from '../main';
import {HIDDEN_CLASS, renderUserRank} from '../utils/utils';

const TOP_FILMS_COUNT = 2;
const MAX_VISIBLE_FILMS = 5;

const body = document.querySelector(`body`);
const rankContainer = document.querySelector(`.profile__rating`);
const filmsContainer = document.querySelector(`.films-list .films-list__container`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const showMoreButton = document.querySelector(`.films-list__show-more`);

let currentVisibleFilms = 0;
let allFilmsData = [];
let currentFilmsData = [];


/**
 * Function for creating film
 * @param {Object[]} films
 * @param {Object} film
 * @param {Boolean} hasControls
 * @return {Node}
 */
const createFilm = (films, film, hasControls) => {
  const filmComponent = new FilmView(film, hasControls);

  filmComponent.onAddToWatchList = () => {
    film.userInfo.isGoingToWatch = !film.userInfo.isGoingToWatch;

    provider.updateFilm({id: film.id, data: film.toRAW()})
      .then((newFilm) => {
        filmComponent.update(newFilm);
        renderFilters(allFilmsData);
      });
  };

  filmComponent.onAddToFavorite = () => {
    film.userInfo.isFavorite = !film.userInfo.isFavorite;

    provider.updateFilm({id: film.id, data: film.toRAW()})
      .then((newFilm) => {
        filmComponent.update(newFilm);
        renderFilters(allFilmsData);
      });
  };

  filmComponent.onMarkAsWatched = () => {
    film.userInfo.isViewed = !film.userInfo.isViewed;

    provider.updateFilm({id: film.id, data: film.toRAW()})
      .then((newFilm) => {
        filmComponent.update(newFilm);
        renderUserRank(rankContainer, films);
        renderFilters(allFilmsData);
      });
  };

  filmComponent.onCommentsClick = () => {
    const filmPopupComponent = new FilmPopupView(film);

    filmPopupComponent.onComment = (newComment) => {
      film.comments.push(newComment);

      provider.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmPopupComponent.unblockComments();
          filmPopupComponent.updateComments(newFilm);
          filmPopupComponent.element.querySelector(`.film-details__watched-status`).textContent = `Comment added`;
          filmPopupComponent.toggleRemoveCommentButton();
        })
        .catch(() => {
          filmPopupComponent.shake();
          filmPopupComponent.errorComments();
        });
    };

    filmPopupComponent.onRemoveComment = () => {
      film.comments.pop();

      provider.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmPopupComponent.updateComments(newFilm);
          filmPopupComponent.element.querySelector(`.film-details__watched-status`).textContent = `Comment deleted`;
          filmPopupComponent.toggleRemoveCommentButton();
        });
    };

    filmPopupComponent.onRatingClick = (newRating) => {
      film.userInfo.rating = newRating;

      provider.updateFilm({id: film.id, data: film.toRAW()})
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

      provider.updateFilm({id: film.id, data: film.toRAW()})
        .then((newFilm) => {
          filmComponent.update(newFilm);
          renderUserRank(rankContainer, films);
          showMostCommentedFilms(filmsTopContainers[1], films);
          renderFilters(films);
          renderUserRank(rankContainer, films);
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

  return filmComponent.render();
};


/**
 * Function for render films to DOM
 * @param {Node} container
 * @param {Object[]} films
 * @param {Boolean} hasControls
 * @param {Number} filmsCount
 * @param {Number} indexStart [indexStart = 0]
 */
const renderFilmsToDom = (container, films, hasControls, filmsCount, indexStart = 0) => {
  const fragment = document.createDocumentFragment();

  for (let i = indexStart; i < filmsCount; i++) {
    fragment.appendChild(createFilm(films, films[i], hasControls));
  }

  container.appendChild(fragment);
};


/**
 * Function for check need to show "Show more button" or no
 * @param {Boolean} needButton
 */
const checkShowMoreButton = (needButton) => {
  if (needButton) {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  } else {
    showMoreButton.classList.add(HIDDEN_CLASS);
    showMoreButton.removeEventListener(`click`, onShowMoreButtonClick);
  }
};


/** Function for render first part of films and check, need "Show More" button or no */
const showFirstFilms = () => {
  let needButton = true;
  currentVisibleFilms = MAX_VISIBLE_FILMS;

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick);

  if (currentFilmsData.length <= MAX_VISIBLE_FILMS) {
    currentVisibleFilms = currentFilmsData.length;
    needButton = false;
  }

  renderFilmsToDom(filmsContainer, currentFilmsData, true, currentVisibleFilms);
  checkShowMoreButton(needButton);
};


/** Function for render parts of films */
const onShowMoreButtonClick = () => {
  const filmsCount = currentFilmsData.length;
  const currentFilmsCount = currentVisibleFilms;
  let needButton = true;

  if (currentVisibleFilms + MAX_VISIBLE_FILMS === filmsCount) {
    currentVisibleFilms += MAX_VISIBLE_FILMS;
    needButton = false;
  } else if (currentVisibleFilms + MAX_VISIBLE_FILMS < filmsCount) {
    currentVisibleFilms += MAX_VISIBLE_FILMS;
  } else {
    currentVisibleFilms = filmsCount;
    needButton = false;
  }

  renderFilmsToDom(filmsContainer, currentFilmsData, true, currentVisibleFilms, currentFilmsCount);
  checkShowMoreButton(needButton);
};


/**
 * Function for render films
 * @param {Node} container
 * @param {Object[]} films
 * @param {Boolean} allFilms [allFilms = true]
 * @param {Boolean} hasControls [hasControls = true]
 * @param {Boolean} isFiltered [isFiltered = false]
 */
export const showFilms = (container, films, allFilms = true, hasControls = true, isFiltered = false) => {
  container.innerHTML = ``;

  if (!isFiltered && allFilms) {
    allFilmsData = films;
    currentFilmsData = films;
  }

  if (allFilms) {
    currentFilmsData = films;
    showFirstFilms();
  } else {
    renderFilmsToDom(container, films, hasControls, films.length);
  }
};


/**
 * Function for render top and most commented films
 * @param {Node} container
 * @param {Object[]} films
 * @param {Function} sortFilms
 */
const renderTopFilms = (container, films, sortFilms) => {
  const filteredFilms = Array.from(films);
  filteredFilms.sort(sortFilms);

  showFilms(container, filteredFilms.splice(0, TOP_FILMS_COUNT), false, false);
};


/**
 * Function for show top films
 * @param {Node} container
 * @param {Object[]} films
 */
export const showTopFilms = (container, films) => {
  const sortFilms = (film1, film2) => film2.filmInfo.rating - film1.filmInfo.rating;

  renderTopFilms(container, films, sortFilms);
};


/**
 * Function for show most commented films
 * @param {Node} container
 * @param {Object[]} films
 */
export const showMostCommentedFilms = (container, films) => {
  const sortFilms = (film1, film2) => film2.comments.length - film1.comments.length;

  renderTopFilms(container, films, sortFilms);
};
