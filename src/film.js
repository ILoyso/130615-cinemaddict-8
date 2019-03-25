import Component from "./component";
import moment from 'moment';

/** Class representing a film */
export default class Film extends Component {

  /**
   * Create c film
   * @param {Object} film
   */
  constructor(film) {
    super();

    this._title = film.title;
    this._poster = film.poster;
    this._description = film.description;
    this._duration = film.duration;
    this._genres = film.genres;
    this._rating = film.rating;
    this._userRating = film.userRating;
    this._comments = film.comments;
    this._premiere = film.premiere;
    this._isFavorite = film.isFavorite;
    this._isViewed = film.isViewed;
    this._isGoingToWatch = film.isGoingToWatch;
    this._hasControls = true;

    this._element = null;
    this._onComments = null;
    this._onWatchList = null;
    this._onWatched = null;
    this._onFavorite = null;

    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._onAddToWatchList = this._onAddToWatchList.bind(this);
    this._onMarkAsWatched = this._onMarkAsWatched.bind(this);
    this._onAddToFavorite = this._onAddToFavorite.bind(this);
  }

  /**
   * Method for comments template
   * @return {string}
   * @private
   */
  _getCommentsTemplate() {
    return `${this._comments.length} comment${this._comments.length > 1 ? `s` : ``}`;
  }

  /**
   * Method for controls template
   * @return {string}
   * @private
   */
  _getControlsTemplate() {
    return `<form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" style="border: ${this._isGoingToWatch ? `1px solid white` : `0 none`}"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" style="border: ${this._isViewed ? `1px solid white` : `0 none`}"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite" style="border: ${this._isFavorite ? `1px solid white` : `0 none`}"><!--Mark as favorite-->FAV</button>
          </form>`;
  }

  /**
   * Method for check for function and if yes to write it in this._onFavorite
   * @param {Event} evt
   * @private
   */
  _onAddToFavorite(evt) {
    evt.preventDefault();
    if (typeof this._onFavorite === `function`) {
      this._onFavorite();
    }
  }

  /**
   * Method for check for function and if yes to write it in this._onWatchList
   * @param {Event} evt
   * @private
   */
  _onAddToWatchList(evt) {
    evt.preventDefault();
    if (typeof this._onWatchList === `function`) {
      this._onWatchList();
    }
  }

  /**
   * Method for check for function and if yes to write it in this._onComments
   * @private
   */
  _onCommentsClick() {
    if (typeof this._onComments === `function`) {
      this._onComments();
    }
  }

  /**
   * Method for check for function and if yes to write it in this._onWatched
   * @param {Event} evt
   * @private
   */
  _onMarkAsWatched(evt) {
    evt.preventDefault();
    if (typeof this._onWatched === `function`) {
      this._onWatched();
    }
  }

  /**
   * Method for update template
   * @private
   */
  _updateTemplate() {
    this._element.querySelector(`.film-card__comments`).innerHTML = this._getCommentsTemplate();

    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).style.border = this._isGoingToWatch ? `1px solid white` : `0 none`;
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).style.border = this._isViewed ? `1px solid white` : `0 none`;
    this._element.querySelector(`.film-card__controls-item--favorite`).style.border = this._isFavorite ? `1px solid white` : `0 none`;
  }

  /**
   * Setter for function that will be work on 'Add to favorite' button
   * @param {Function} fn
   */
  set onAddToFavorite(fn) {
    this._onFavorite = fn;
  }

  /**
   * Setter for function that will be work on 'Add to watch list' button
   * @param {Function} fn
   */
  set onAddToWatchList(fn) {
    this._onWatchList = fn;
  }

  /**
   * Setter for function that will be work on Comments click
   * @param {Function} fn
   */
  set onCommentsClick(fn) {
    this._onComments = fn;
  }

  /**
   * Setter for function that will be work on 'Add to watched' button
   * @param {Function} fn
   */
  set onMarkAsWatched(fn) {
    this._onWatched = fn;
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
            <span class="film-card__year">${moment(this._premiere).format(`YYYY`)}</span>
            <span class="film-card__duration">${moment.duration(this._duration).hours()}h&nbsp;${moment.duration(this._duration).minutes()}m </span>
            <span class="film-card__genre">${this._genres.join(`, `)}</span>
          </p>
          <img src="./images/posters/${this._poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <button class="film-card__comments">${this._getCommentsTemplate()}</button>
          ${this._hasControls ? this._getControlsTemplate() : ``}
        </article>`;
  }

  /** Method for bing functions to task */
  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onAddToWatchList);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onMarkAsWatched);
    this._element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onAddToFavorite);
  }

  /** Method for unbing function from task */
  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`submit`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).removeEventListener(`click`, this._onAddToWatchList);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).removeEventListener(`click`, this._onMarkAsWatched);
    this._element.querySelector(`.film-card__controls-item--favorite`).removeEventListener(`click`, this._onAddToFavorite);
  }

  /**
   * Method for update film regarding new data
   * @param {Object} film
   */
  update(film) {
    this._userRating = film.userRating;
    this._comments = film.comments;
    this._isFavorite = film.isFavorite;
    this._isViewed = film.isViewed;
    this._isGoingToWatch = film.isGoingToWatch;
    this._updateTemplate();
  }
}
