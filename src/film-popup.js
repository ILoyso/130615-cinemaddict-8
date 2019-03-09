import {months, MAX_FILM_RATING, createElement} from "./utils";

/** Class representing a film popup */
export default class FilmPopup {

  /**
   * Create a popup
   * @param {Object} data
   */
  constructor(data) {
    this._title = data.title;
    this._originalTitle = data.originalTitle;
    this._poster = data.poster;
    this._actors = data.actors;
    this._description = data.description;
    this._duration = data.duration;
    this._genres = data.genres;
    this._restrictions = data.restrictions;
    this._premiere = data.premiere;
    this._userRating = data.userRating;
    this._rating = data.rating;
    this._country = data.country;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;

    this._element = null;
    this._onClose = null;
  }

  /**
   * Method for converting data
   * @return {Object}
   * @private
   */
  _convertDate() {
    const dateStandart = new Date(this._premiere);
    const convertedDate = dateStandart.toString().split(` `);
    let fullDate = {};
    fullDate.day = convertedDate[2];
    fullDate.month = months[dateStandart.getMonth()];
    fullDate.year = convertedDate[0];

    return fullDate;
  }

  /**
   * Method for creating genres template
   * @return {String}
   * @private
   */
  _getGenresTemplate() {
    return this._genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
  }

  /**
   * Method for creating rating template
   * @return {string}
   * @private
   */
  _getUserRating() {
    let ratingTemplate = ``;

    for (let i = 1; i <= MAX_FILM_RATING; i++) {
      ratingTemplate += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${this._userRating === i ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
    }

    return ratingTemplate;
  }

  /**
   * Method for check for function and if yes to white it in this._onClose
   * @private
   */
  _onCloseButtonClick() {
    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  /**
   * Setter for function that will be work on close button click
   * @param {Function} fn
   */
  set onClose(fn) {
    this._onClose = fn;
  }

  /**
   * Getter for DOM element (if it is)
   * @return {Node}
   */
  get element() {
    return this._element;
  }

  /**
   * Getter for popup template
   * @return {string}
   */
  get template() {
    return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="images/posters/${this._poster}.jpg" alt="${this._originalTitle}">
    
            <p class="film-details__age">${this._restrictions}+</p>
          </div>
    
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._originalTitle}</p>
              </div>
    
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                <p class="film-details__user-rating">Your rate ${this._userRating}</p>
              </div>
            </div>
    
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${this._convertDate().day} ${this._convertDate().month} ${this._convertDate().year} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${this._getGenresTemplate()}
                </td>
              </tr>
            </table>
    
            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>
    
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isGoingToWatch ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
    
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isViewed ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
    
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
    
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">1</span></h3>
    
          <ul class="film-details__comments-list">
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">😴</span>
              <div>
                <p class="film-details__comment-text">So long-long story, boring!</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">Tim Macoveev</span>
                  <span class="film-details__comment-day">3 days ago</span>
                </p>
              </div>
            </li>
          </ul>
    
          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
    
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>
    
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>
    
          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="images/posters/${this._poster}.jpg" alt="film-poster" class="film-details__user-rating-img">
            </div>
    
            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>
    
              <p class="film-details__user-rating-feelings">How you feel it?</p>
    
              <div class="film-details__user-rating-score">
                ${this._getUserRating()}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`;
  }

  /** Method for bing function to close button */
  bind() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseButtonClick.bind(this));
  }

  /**
   * Method for render popup and add events
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbing function from close button */
  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseButtonClick.bind(this));
  }

  /** Method for unrender popup */
  unrender() {
    this.unbind();
    this._element = null;
  }
}
