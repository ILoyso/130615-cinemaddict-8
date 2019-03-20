import Component from "./component";
import moment from 'moment';

/** Class representing a film */
export default class Film extends Component {

  /**
   * Create c film
   * @param {Object} data
   */
  constructor(data) {
    super();

    this._title = data.title;
    this._poster = data.poster;
    this._description = data.description;
    this._duration = data.duration;
    this._genres = data.genres;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._premiere = data.premiere;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;
    this._hasControls = true;

    this._element = null;
    this._onComments = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);
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
   * Method for update template
   * @private
   */
  _updateTemplate() {
    this._element.querySelector(`.film-card__comments`).innerHTML = this._getCommentsTemplate();
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

  /** Method for bing function to comments */
  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick);
  }

  /** Method for unbing function from comments */
  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`submit`, this._onCommentsClick);
  }

  /**
   * Method for update film regarding new data
   * @param {Object} data
   */
  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;
    this._updateTemplate();
  }
}
