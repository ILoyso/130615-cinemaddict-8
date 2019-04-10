import FilmView from './film-view';
import FilmPopupView from './film-popup-view';
import {provider} from '../main';
import {renderUserRank} from '../utils/utils';

const body = document.querySelector(`body`);
const rankContainer = document.querySelector(`.profile__rating`);
const filmsTopContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);

const TOP_FILMS_COUNT = 2;


/**
 * Function for render films
 * @param {Node} container
 * @param {Object[]} films
 * @param {Boolean} hasControls [hasControls = true]
 */
export const renderFilms = (container, films, hasControls = true) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  films.forEach((film) => {
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

    fragment.appendChild(filmComponent.render());
  });

  container.appendChild(fragment);
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

  renderFilms(container, filteredFilms.splice(0, TOP_FILMS_COUNT), false);
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

  renderFilms(container, filteredFilms.splice(0, TOP_FILMS_COUNT), false);
};
