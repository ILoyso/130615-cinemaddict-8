export const MAX_FILM_RATING = 10;
export const ENTER_KEY_CODE = 13;

export const Time = {
  YEAR: 365,
  MONTH: 30,
  DAY: 24,
  HOUR: 60,
  MINUTE: 60,
  SECOND: 1000
};

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
