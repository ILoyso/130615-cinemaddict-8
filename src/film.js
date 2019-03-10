import {Time, createElement} from "./utils";

/** Class representing a film */
export default class Film {

  /**
   * Create c film
   * @param {Object} data
   */
  constructor(data) {
    this._title = data.title;
    this._poster = data.poster;
    this._year = data.year;
    this._description = data.description;
    this._duration = data.duration;
    this._genres = data.genres;
    this._rating = data.rating;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;
    this._hasControls = true;

    this._element = null;
    this._onComments = null;
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
   * Method for check for function and if yes to white it in this._onComments
   * @private
   */
  _onCommentsClick() {
    if (typeof this._onComments === `function`) {
      this._onComments();
    }
  }

  /**
   * Setter for function that will be work on Comments click
   * @param {Function} fn
   */
  set onCommentsClick(fn) {
    this._onComments = fn;
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
            <span class="film-card__genre">${this._genres.join(`, `)}</span>
          </p>
          <img src="./images/posters/${this._poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <button class="film-card__comments">13 comments</button>
          ${this._hasControls ? this._getControlsTemplate() : ``}
        </article>`;
  }

  /** Method for bing function to comments */
  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick.bind(this));
  }

  /**
   * Method for render film and add events
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbing function from comments */
  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`submit`, this._onCommentsClick.bind(this));
  }

  /** Method for unrender film */
  unrender() {
    this.unbind();
    this._element = null;
  }

}
