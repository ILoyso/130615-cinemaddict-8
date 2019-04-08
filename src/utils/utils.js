export const MAX_FILM_RATING = 10;

export const KeyCodes = {
  ENTER: 13,
  ESC: 27
};

export const Time = {
  YEAR: 365,
  MONTH: 30,
  DAY: 24,
  HOUR: 60,
  MINUTE: 60,
  SECOND: 1000
};

export const HIDDEN_CLASS = `visually-hidden`;

/**
 * Function for denerate random number, not including max
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;


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
