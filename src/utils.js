export const MAX_FILM_RATING = 10;
export const ENTER_KEY_CODE = 13;

export const Time = {
  YEAR: 365,
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
 * Function for generate random boolean - true/false
 * @return {Boolean}
 */
export const generateRandomBoolean = () => generateRandomNumber(2) === 0;


/**
 * Function for find random array item
 * @param {Array} values
 * @return {*}
 */
export const getRandomValue = (values) => values[generateRandomNumber(values.length)];


/**
 * Function for find few random array elements
 * @param {Array} array
 * @param {Number} amount
 * @return {Array}
 */
export const getRandomArrayElements = (array, amount) => {
  let arrayCopy = Array.from(array);
  let newArray = [];

  while (amount > 0) {
    newArray.push(arrayCopy.splice([generateRandomNumber(arrayCopy.length)], 1).join(``));
    amount--;
  }
  return newArray;
};


/**
 * Function for render string template to the DOM element
 * @param {Node} parent
 * @param {String} template
 */
export const renderTemplate = (parent, template) => {
  parent.insertAdjacentHTML(`beforeend`, template);
};


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
