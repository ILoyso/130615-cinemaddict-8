import FilmView from './film-view';
import FilmPopupView from './film-popup-view';
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
      });
  };

  filmComponent.onAddToFavorite = () => {
    film.userInfo.isFavorite = !film.userInfo.isFavorite;

    provider.updateFilm({id: film.id, data: film.toRAW()})
      .then((newFilm) => {
        filmComponent.update(newFilm);
      });
  };

  filmComponent.onMarkAsWatched = () => {
    film.userInfo.isViewed = !film.userInfo.isViewed;

    provider.updateFilm({id: film.id, data: film.toRAW()})
      .then((newFilm) => {
        filmComponent.update(newFilm);
        renderUserRank(rankContainer, films);
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
          renderMostCommentedFilms(filmsTopContainers[1], films);
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
 * Function for check need to show "Show more button" or no
 * @param {Boolean} needButton
 */
const checkShowMoreButton = (needButton) => {
  if (needButton) {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  } else {
    showMoreButton.classList.add(HIDDEN_CLASS);
    showMoreButton.removeEventListener(`click`, renderFilmsPartly);
  }
};


/** Function for render first part of films and check, need "Show More" button or no */
const renderFirstFilms = () => {
  const fragment = document.createDocumentFragment();
  let needButton = true;
  currentVisibleFilms = MAX_VISIBLE_FILMS;

  showMoreButton.addEventListener(`click`, renderFilmsPartly);

  if (allFilmsData.length <= MAX_VISIBLE_FILMS) {
    currentVisibleFilms = allFilmsData.length;
    needButton = false;
  }

  for (let i = 0; i < currentVisibleFilms; i++) {
    fragment.appendChild(createFilm(allFilmsData, allFilmsData[i], true));
  }

  checkShowMoreButton(needButton);
  filmsContainer.appendChild(fragment);
};


/** Function for render parts of films */
const renderFilmsPartly = () => {
  const fragment = document.createDocumentFragment();
  const filmsCount = allFilmsData.length;
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

  for (let i = currentFilmsCount; i < currentVisibleFilms; i++) {
    fragment.appendChild(createFilm(allFilmsData, allFilmsData[i], true));
  }

  checkShowMoreButton(needButton);
  filmsContainer.appendChild(fragment);
};


/**
 * Function for render films
 * @param {Node} container
 * @param {Object[]} films
 * @param {Boolean} allFilms [allFilms = true]
 * @param {Boolean} hasControls [hasControls = true]
 */
export const renderFilms = (container, films, allFilms = true, hasControls = true) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  if (allFilms) {
    allFilmsData = films;
    renderFirstFilms();
  } else {
    films.forEach((film) => {
      fragment.appendChild(createFilm(films, film, hasControls));
    });
    container.appendChild(fragment);
  }
};


/**
 * Function for render top films
 * @param {Node} container
 * @param {Object[]} films
 */
export const renderTopFilms = (container, films) => {
  const filteredFilms = Array.from(films);
  const sortFilms = (film1, film2) => film2.filmInfo.rating - film1.filmInfo.rating;
  filteredFilms.sort(sortFilms);

  renderFilms(container, filteredFilms.splice(0, TOP_FILMS_COUNT), false, false);
};


/**
 * Function for render most commented films
 * @param {Node} container
 * @param {Object[]} films
 */
export const renderMostCommentedFilms = (container, films) => {
  const filteredFilms = Array.from(films);
  const sortFilms = (film1, film2) => film2.comments.length - film1.comments.length;
  filteredFilms.sort(sortFilms);

  renderFilms(container, filteredFilms.splice(0, TOP_FILMS_COUNT), false, false);
};
