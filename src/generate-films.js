import getFilm from "./get-film";

/**
 * Function for generate array with all films data
 * @param {Number} amount
 * @return {Object[]}
 */
export default (amount) => {
  let filmsTemplate = [];
  for (let i = 0; i < amount; i++) {
    filmsTemplate.push(getFilm());
  }
  return filmsTemplate;
};
