import {Time} from './utils';

const controlsTemplate = `<form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
          </form>`;

export default (film, hasControls = true) => `<article class="film-card ${hasControls ? `` : `film-card--no-controls`}">
          <h3 class="film-card__title">${film.title}</h3>
          <p class="film-card__rating">${film.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${film.year}</span>
            <span class="film-card__duration">${Math.round(film.duration / Time.HOUR)}h&nbsp;${film.duration % Time.HOUR}m</span>
            <span class="film-card__genre">${film.genre}</span>
          </p>
          <img src="./images/posters/${film.poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${film.description}</p>
          <button class="film-card__comments">13 comments</button>
          ${hasControls ? controlsTemplate : ``}
        </article>`;


