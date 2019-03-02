import makeFilm from "./make-film";
import getFilm from "./get-film";

export default (amount, hasControls) => {
  let filmsTemplate = [];
  for (let i = 0; i < amount; i++) {
    filmsTemplate.push(makeFilm(getFilm(), hasControls));
  }
  return filmsTemplate;
};
