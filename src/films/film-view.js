import Component from '../utils/component';
import moment from 'moment';
import 'moment-duration-format';
import {HIDDEN_CLASS} from '../utils/utils';

const MAX_DESCRIPTION_LENGTH = 140;

/** Class representing a film */
export default class FilmView extends Component {

  /**
   * Create c film
   * @param {Object} film
   * @param {Boolean} hasControls
   */
  constructor(film, hasControls = true) {
    super();

    this._id = film.id;
    this._filmInfo = {
      title: film.filmInfo.title,
      originalTitle: film.filmInfo.originalTitle,
      description: film.filmInfo.description,
      poster: film.filmInfo.poster,
      duration: film.filmInfo.duration,
      premiere: film.filmInfo.premiere,
      rating: film.filmInfo.rating
    };
    this._userInfo = {
      isFavorite: film.userInfo.isFavorite,
      isViewed: film.userInfo.isViewed,
      isGoingToWatch: film.userInfo.isGoingToWatch,
      rating: film.userInfo.rating,
      date: film.userInfo.date
    };
    this._comments = film.comments;

    this._hasControls = hasControls;
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
          <h3 class="film-card__title">${this._filmInfo.title ? this._filmInfo.title : this._filmInfo.originalTitle}</h3>
          <p class="film-card__rating">${this._filmInfo.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${moment(this._filmInfo.premiere).format(`YYYY`)}</span>
            <span class="film-card__duration">${moment.duration(this._filmInfo.duration).format(`h:mm`)}</span>
          </p>
          <img src="./images/posters/${this._filmInfo.poster}.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">${this._getDescriptionTemplate()}</p>
          <button class="film-card__comments">${this._getCommentsTemplate()}</button>
          ${this._getControlsTemplate()}
        </article>`;
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
    return `<form class="film-card__controls ${this._hasControls ? `` : HIDDEN_CLASS}">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" style="border: ${this._userInfo.isGoingToWatch ? `1px solid white` : `0 none`}"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" style="border: ${this._userInfo.isViewed ? `1px solid white` : `0 none`}"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite" style="border: ${this._userInfo.isFavorite ? `1px solid white` : `0 none`}"><!--Mark as favorite-->FAV</button>
          </form>`;
  }

  /**
   * Method for description template
   * @return {string}
   * @private
   */
  _getDescriptionTemplate() {
    if (this._filmInfo.description.length > MAX_DESCRIPTION_LENGTH) {
      return `${this._filmInfo.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
    }

    return `${this._filmInfo.description}`;
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

    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).style.border = this._userInfo.isGoingToWatch ? `1px solid white` : `0 none`;
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).style.border = this._userInfo.isViewed ? `1px solid white` : `0 none`;
    this._element.querySelector(`.film-card__controls-item--favorite`).style.border = this._userInfo.isFavorite ? `1px solid white` : `0 none`;
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
    this._userInfo = {
      userRating: film.userInfo.userRating,
      isFavorite: film.userInfo.isFavorite,
      isViewed: film.userInfo.isViewed,
      isGoingToWatch: film.userInfo.isGoingToWatch
    };
    this._comments = film.comments;
    this._updateTemplate();
  }
}
