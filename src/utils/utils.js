export const MAX_FILM_RATING = 9;

export const KeyCodes = {
  ENTER: 13,
  ESC: 27
};

const Ranks = [`Notice`, `Fan`, `Movie buff`];

export const HIDDEN_CLASS = `visually-hidden`;


/**
 * Function for creating DOM element
 * @param {String} template
 * @return {Node}
 */
export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstChild;
};


/**
 * Function for check is n number or not
 * @param {*} n
 * @return {Boolean}
 */
export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


/**
 * Function for check should 'Show more' button be visible or no
 * @param {Node} button
 * @param {Object[]} films
 */
export const checkLoadMoreButton = (button, films) => {
  if (films.length === 0) {
    button.classList.add(HIDDEN_CLASS);
  } else {
    button.classList.remove(HIDDEN_CLASS);
  }
};


/**
 * Function for show loader
 * @param {Node} container
 * @param {String} text
 */
export const showLoader = (container, text = `Loading movies...`) => {
  container.textContent = text;
  container.classList.remove(HIDDEN_CLASS);
};


/**
 * Function for hide loader
 * @param {Node} container
 */
export const hideLoader = (container) => {
  container.textContent = `Loading movies...`;
  container.classList.add(HIDDEN_CLASS);
};


/**
 * Method for show user rank
 * @param {Node} container
 * @param {Object[]} films
 */
export const renderUserRank = (container, films) => {
  let userRank = ``;
  const filteredFilms = films.filter((it) => it.userInfo.isViewed);

  if (filteredFilms.length <= 10) {
    userRank = Ranks[0];
  } else if (filteredFilms.length <= 20) {
    userRank = Ranks[1];
  } else {
    userRank = Ranks[2];
  }

  container.textContent = userRank;
};
