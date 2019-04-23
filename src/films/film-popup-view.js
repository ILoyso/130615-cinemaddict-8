import {MAX_FILM_RATING, KeyCodes, HIDDEN_CLASS} from '../utils/utils';
import Component from '../utils/component';
import moment from 'moment';

/** Class representing a film popup */
export default class FilmPopupView extends Component {

  /**
   * Create a popup
   * @param {Object} film
   */
  constructor(film) {
    super();

    this._id = film.id;
    this._filmInfo = {
      title: film.filmInfo.title,
      description: film.filmInfo.description,
      poster: film.filmInfo.poster,
      duration: film.filmInfo.duration,
      genres: film.filmInfo.genres,
      premiere: film.filmInfo.premiere,
      rating: film.filmInfo.rating,
      originalTitle: film.filmInfo.originalTitle,
      actors: film.filmInfo.actors,
      restrictions: film.filmInfo.restrictions,
      country: film.filmInfo.country,
      director: film.filmInfo.director,
      writers: film.filmInfo.writers,
    };
    this._userInfo = {
      isFavorite: film.userInfo.isFavorite,
      isViewed: film.userInfo.isViewed,
      isGoingToWatch: film.userInfo.isGoingToWatch,
      rating: film.userInfo.rating,
    };

    this._comments = film.comments;

    this._element = null;
    this._onClose = null;
    this._onComment = null;
    this._onRemoveComment = null;
    this._onRatingClick = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
    this._onRemoveLastComment = this._onRemoveLastComment.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
  }

  /**
   * Setter for function that will be work on close button click
   * @param {Function} fn
   */
  set onClose(fn) {
    this._onClose = fn;
  }

  /**
   * Setter for function that will be work on add new comment
   * @param {Function} fn
   */
  set onComment(fn) {
    this._onComment = fn;
  }

  /**
   * Setter for function that will be work on change rating
   * @param {Function} fn
   */
  set onRatingClick(fn) {
    this._onRatingClick = fn;
  }

  /**
   * Setter for function that will be work on remove last comment
   * @param {Function} fn
   */
  set onRemoveComment(fn) {
    this._onRemoveComment = fn;
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
            <img class="film-details__poster-img" src="images/posters/${this._filmInfo.poster}.jpg" alt="${this._filmInfo.originalTitle}">
    
            <p class="film-details__age">${this._filmInfo.restrictions}+</p>
          </div>
    
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${this._filmInfo.originalTitle}</p>
              </div>
    
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._filmInfo.rating}</p>
                <p class="film-details__user-rating">Your rate <span>${this._userInfo.rating}</span></p>
              </div>
            </div>
    
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._filmInfo.writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._filmInfo.actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._filmInfo.premiere).format(`D MMMM YYYY`)} (${this._filmInfo.country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${Math.trunc(moment.duration(this._filmInfo.duration).asMinutes())} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._filmInfo.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${this._getGenresTemplate()}
                </td>
              </tr>
            </table>
    
            <p class="film-details__film-description">
              ${this._filmInfo.description}
            </p>
          </div>
        </div>
    
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._userInfo.isGoingToWatch ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
    
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._userInfo.isViewed ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
    
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._userInfo.isFavorite ? `checked` : ``}>
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
            <span class="film-details__watched-status"></span>
            <button class="film-details__watched-reset visually-hidden" type="button">undo</button>
          </div>
    
          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="images/posters/${this._filmInfo.poster}.jpg" alt="film-poster" class="film-details__user-rating-img">
            </div>
    
            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._filmInfo.title ? this._filmInfo.title : this._filmInfo.originalTitle}</h3>
    
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

  /**
   * Method for creating comments template
   * @return {String}
   * @private
   */
  _getCommentsTemplate() {
    return this._comments.map((comment) => {
      const element = document.createElement(`div`);
      element.textContent = comment.text;

      return `<li class="film-details__comment">
          <span class="film-details__comment-emoji">${comment.emoji}</span>
          <div>
            <p class="film-details__comment-text">${element.innerHTML}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${moment(comment.date).startOf(`min`).fromNow()}</span>
            </p>
          </div>
        </li>`;
    }).join(``);
  }

  /**
   * Method for creating genres template
   * @return {String}
   * @private
   */
  _getGenresTemplate() {
    return Array.from(this._filmInfo.genres).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
  }

  /**
   * Method for creating rating template
   * @return {string}
   * @private
   */
  _getUserRating() {
    let ratingTemplate = ``;

    for (let i = 1; i <= MAX_FILM_RATING; i++) {
      ratingTemplate += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${this._userInfo.rating === i ? `checked` : ``}>
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
    this._element.querySelector(`.film-details__comment-input`).style.border = `1px solid #979797`;

    if ((evt.ctrlKey || evt.metaKey) && (evt.keyCode === KeyCodes.ENTER)) {
      evt.preventDefault();
      this.blockComments();

      const newComment = {};
      const textarea = this._element.querySelector(`.film-details__comment-input`);
      newComment.text = textarea.value;
      newComment.author = `Me`;
      newComment.emoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
      newComment.date = moment().valueOf();

      if (typeof this._onComment === `function`) {
        this._onComment(newComment);
      }
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
    this.blockRating();
    const newRating = this._element.querySelector(`.film-details__user-rating-input:checked`).value;

    if (typeof this._onRatingClick === `function`) {
      this._onRatingClick(newRating);
    }
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
   * Method for close popup if on Esc press
   * @param {Event} evt
   * @private
   */
  _onEscPress(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      this._onCloseButtonClick();
    }
  }

  /**
   * Method for remove last comment
   * @private
   */
  _onRemoveLastComment() {
    if (typeof this._onRemoveComment === `function`) {
      this._onRemoveComment();
    }
  }

  /**
   * Method for saving updated data
   * @param {FormData} formData
   * @return {Object}
   * @private
   */
  _processForm(formData) {
    const entry = {
      userInfo: {
        rating: this._userInfo.rating,
        isFavorite: false,
        isViewed: false,
        isGoingToWatch: false,
      },
      comments: this._comments
    };

    const filmPopupMapper = FilmPopupView.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmPopupMapper[property]) {
        filmPopupMapper[property](value);
      }
    }

    return entry;
  }

  /** Method for bing function to close button */
  bind() {
    document.addEventListener(`keydown`, this._onEscPress);

    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((element) => {
      element.addEventListener(`click`, this._onChangeEmoji);
    });

    this._element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddComment);
    this._element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onRemoveLastComment);

    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.addEventListener(`click`, this._onChangeRating);
    });
  }

  /** Method for block comments field */
  blockComments() {
    this._element.querySelectorAll(`.film-details__add-emoji`).disabled = true;
    this._element.querySelectorAll(`.film-details__comment-input`).disabled = true;
  }

  /** Method for block rating field */
  blockRating() {
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.disabled = true;
    });
  }

  /** Method for show error in comments block */
  errorComments() {
    this._element.querySelector(`.film-details__comment-input`).style.border = `3px solid red`;
    this.unblockComments();
  }

  /** Method for show error in rating block */
  errorRating() {
    this._element.querySelectorAll(`.film-details__user-rating-label`).forEach((element) => {
      element.style.background = `#d8d8d8`;
    });
    this._element.querySelector(`.film-details__user-rating-input:checked + label`).style.background = `red`;
    this.unblockRating();
  }

  /** Method for show shake animation */
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.querySelector(`.film-details__inner`).style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;


    setTimeout(() => {
      this._element.querySelector(`.film-details__inner`).style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  /** Method for show/hide button for remove last comment */
  toggleRemoveCommentButton() {
    this._element.querySelector(`.film-details__watched-reset`).classList.toggle(HIDDEN_CLASS);
  }

  /** Method for unbing function from close button */
  unbind() {
    document.removeEventListener(`keydown`, this._onEscPress);

    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseButtonClick);

    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((element) => {
      element.removeEventListener(`click`, this._onChangeEmoji);
    });

    this._element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._onAddComment);
    this._element.querySelector(`.film-details__watched-reset`).removeEventListener(`click`, this._onRemoveLastComment);

    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.removeEventListener(`click`, this._onChangeRating);
    });
  }

  /** Method for unblock comments field */
  unblockComments() {
    this._element.querySelectorAll(`.film-details__add-emoji`).disabled = false;
    this._element.querySelectorAll(`.film-details__comment-input`).disabled = false;
  }

  /** Method for unblock rating field */
  unblockRating() {
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((element) => {
      element.disabled = false;
    });
  }

  /**
   * Method for update popup regarding new data
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
  }

  /**
   * Method for update comments after add a new one
   * @param {Object} film
   */
  updateComments(film) {
    this._comments = film.comments;
    this._element.querySelector(`.film-details__add-emoji`).checked = false;
    this._element.querySelector(`.film-details__comment-input`).value = ``;
    this._element.querySelector(`.film-details__comments-list`).innerHTML = this._getCommentsTemplate();
  }

  /**
   * Method for update rating after changing
   * @param {Object} film
   */
  updateRating(film) {
    this._userInfo.rating = film.userInfo.rating;
    this._element.querySelector(`.film-details__user-rating span`).innerHTML = this._userInfo.rating;
  }

  /**
   * Method for mapping data from form
   * @param {Object} target
   * @return {Object}
   */
  static createMapper(target) {
    return {
      score: (value) => {
        target.userInfo.rating = parseInt(value, 10);
      },
      watchlist: (value) => {
        target.userInfo.isGoingToWatch = value === `on`;
      },
      watched: (value) => {
        target.userInfo.isViewed = value === `on`;
      },
      favorite: (value) => {
        target.userInfo.isFavorite = value === `on`;
      }
    };
  }
}
