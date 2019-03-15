import {MAX_FILM_RATING, ENTER_KEY_CODE} from "./utils";
import Component from "./component";
import moment from 'moment';

/** Class representing a film popup */
export default class FilmPopup extends Component {

  /**
   * Create a popup
   * @param {Object} data
   */
  constructor(data) {
    super();

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
    this._comments = data.comments;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;

    this._element = null;
    this._onClose = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
  }

  /**
   * Method for creating comments template
   * @return {String}
   * @private
   */
  _getCommentsTemplate() {
    return this._comments.map((comment) => `<li class="film-details__comment">
          <span class="film-details__comment-emoji">${comment.emoji}</span>
          <div>
            <p class="film-details__comment-text">${comment.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${moment(comment.date).startOf(`min`).fromNow()}</span>
            </p>
          </div>
        </li>`).join(``);
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
   * Method for adding new comment
   * @param {Event} evt
   * @private
   */
  _onAddComment(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      evt.preventDefault();
      const newComment = {};
      const textarea = this._element.querySelector(`.film-details__comment-input`);
      newComment.text = textarea.value;
      newComment.author = `Me`;
      newComment.emoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
      newComment.date = moment();

      this._comments.push(newComment);

      textarea.value = ``;
      this._element.querySelector(`.film-details__add-emoji`).checked = false;
      this._element.querySelector(`.film-details__comments-list`).innerHTML = this._getCommentsTemplate();
    }
  }

  /**
   * Method for update emoji
   * @private
   */
  _onChangeEmoji() {
    const emoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
  }

  /**
   * Method for update user rating
   * @private
   */
  _onChangeRating() {
    this._userRating = this._element.querySelector(`.film-details__user-rating-input:checked`).value;
    this._element.querySelector(`.film-details__user-rating span`).innerHTML = this._userRating;
  }

  /**
   * Method for check for function and if yes to white it in this._onClose
   * @private
   */
  _onCloseButtonClick() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);

    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }

    this.update(newData);
  }

  /**
   * Method for saving updated data
   * @param {FormData} formData
   * @return {Object}
   * @private
   */
  _processForm(formData) {
    const entry = {
      userRating: this._userRating,
      comments: this._comments,
      isFavorite: this._isFavorite,
      isViewed: this._isViewed,
      isGoingToWatch: this._isGoingToWatch
    };

    const filmPopupMapper = FilmPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmPopupMapper[property]) {
        filmPopupMapper[property](value);
      }
    }

    return entry;
  }

  /**
   * Setter for function that will be work on close button click
   * @param {Function} fn
   */
  set onClose(fn) {
    this._onClose = fn;
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
                <p class="film-details__user-rating">Your rate <span>${this._userRating}</span></p>
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
                <td class="film-details__cell">${moment(this._premiere).format(`D MMMM YYYY`)} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${Math.trunc(moment.duration(this._duration).asMinutes())} min</td>
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
          <h3 class="film-details__comments-title">Comment${this._comments.length > 1 ? `s` : ``} <span class="film-details__comments-count">${this._comments.length}</span></h3>
          
          <ul class="film-details__comments-list">
            ${this._getCommentsTemplate()}
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
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((element) => {
      element.addEventListener(`click`, this._onChangeEmoji);
    });

    this._element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddComment);

    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.addEventListener(`click`, this._onChangeRating);
    });
  }

  /** Method for unbing function from close button */
  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((element) => {
      element.removeEventListener(`click`, this._onChangeEmoji);
    });

    this._element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._onAddComment);

    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.removeEventListener(`click`, this._onChangeRating);
    });
  }

  /**
   * Method for update popup regarding new data
   * @param {Object} data
   */
  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isFavorite = data.isFavorite;
    this._isViewed = data.isViewed;
    this._isGoingToWatch = data.isGoingToWatch;
  }

  /**
   * Method for mapping data from form
   * @param {Object} target
   * @return {Object}
   */
  static createMapper(target) {
    return {
      score: (value) => {
        target.userRating = parseInt(value, 10);
      },
      watchlist: (value) => {
        target.isGoingToWatch = value === `on`;
      },
      watched: (value) => {
        target.isViewed = value === `on`;
      },
      favorite: (value) => {
        target.isFavorite = value === `on`;
      }
    };
  }
}
