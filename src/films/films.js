import FilmView from './film-view';
import FilmPopupView from './film-popup-view';
import {provider} from '../main';

const body = document.querySelector(`body`);


/**
 * Function for render films
 * @param {Node} container
 * @param {Object[]} films
 */
export const renderFilms = (container, films) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  films.forEach((film) => {
    const filmComponent = new FilmView(film);

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
 * @param {NodeListOf} containers
 * @param {Object[]} films
 */
export const renderTopFilms = (containers, films) => {
  containers.forEach((container) => {
    renderFilms(container, films);
  });
};
