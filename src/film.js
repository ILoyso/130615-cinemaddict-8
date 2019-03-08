import {Time, createElement} from "./utils";

/** Class representing a film */
export default class Film {

  /**
   * Create c film
   * @param {Object} data
   * @param {Boolean} hasControls
   */
  constructor(data, hasControls = true) {
    this._title = data.title;
    this._originalTitle = data.originalTitle;
    this._poster = data.poster;
    this._year = data.year;
    this._actors = data.actors;
    this._description = data.description;
    this._duration = data.duration;
    this._type = data.type;
    this._season = data.season;
    this._episodes = data.episodes;
    this._genre = data.genre;
    this._restrictions = data.restrictions;
    this._premiere = data.premiere;
    this._dvd = data.dvd;
    this._userRating = data.userRating;
    this._rating = data.rating;
    this._country = data.country;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;

    this._hasControls = hasControls;

    this._element = null;
  }

  /**
   * Method for controls template
   * @return {string}
   * @private
   */
  _getControlsTemplate() {
    return `<form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
          </form>`;
  }

  /**
   * Getter for film template
   * @return {string}
   */
  get template() {
    return `<article class="film-card ${this._hasControls ? `` : `film-card--no-controls`}">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${this._year}</span>
            <span class="film-card__duration">${Math.round(this._duration / Time.HOUR)}h&nbsp;${this._duration % Time.HOUR}m</span>
            <span class="film-card__genre">${this._genre}</span>
          </p>
          <img src="./images/posters/${this._poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <button class="film-card__comments">13 comments</button>
          ${this._hasControls ? this._getControlsTemplate() : ``}
        </article>`;
  }

  /**
   * Method for render film and add events
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    return this._element;
  }

  /** Method for unrender film */
  unrender() {
    this._element = null;
  }

}
