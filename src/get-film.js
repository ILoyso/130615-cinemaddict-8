import {
  getRandomValue,
  generateRandomNumber,
  getRandomArrayElements,
  generateRandomBoolean,
  Time
} from './utils';

const titles = [
  `The Lion King`,
  `The Bucket List`,
  `The Notebook`,
  `Kimi no na wa`,
  `La La Land`,
  `The Green Mile`,
  `Gattaca`,
  `Honig im Kopf`,
  `Barfuss`,
  `Home Alone`,
  `Chocolat`,
  `Leon`,
  `Les Choristes`,
  `Burlesque`,
  `The Great Gatsby`
];

const posters = [
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `moonrise`,
  `three-friends`
];

const actors = [
  `Эми Адамс`,
  `Дженнифер Анистон`,
  `Бен Аффлек`,
  `Кейси Аффлек`,
  `Антонио Бандерас`,
  `Хавьер Бардем`,
  `Джерард Батлер`,
  `Шон Бин`,
  `Эмили Блант`,
  `Кейт Бланшетт`,
  `Орландо Блум`,
  `Фёдор Бондарчук`,
  `Джош Бролин`,
  `Стив Бушеми`,
  `Кристиан Бэйл`
];

const descriptions = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `);

const genres = new Set([
  `Romance comedy`,
  `Science fiction`,
  `Horror`,
  `Documentary`,
  `Animation`,
  `Thriller`,
  `Drama`,
  `Comedy`,
  `Adventure`
]);

const restrictions = new Set([0, 6, 12, 16, 18]);

const types = new Set([
  `series`,
  `big cinema`,
  `art house`,
  `animation`
]);

const countries = new Set([
  `United Kingdom`,
  `Sweden`,
  `Austria`,
  `France`,
  `Germany`,
  `Italy`,
  `United States`,
  `Canada`,
  `Russia`,
  `Spain`,
  `Korea`,
  `Japan`
]);

export default () => ({
  title: getRandomValue(titles),
  poster: getRandomValue(posters),
  originalTitle: getRandomValue(titles),
  year: generateRandomNumber(2019, 1900),
  actors: getRandomArrayElements(actors, 3),
  description: getRandomArrayElements(descriptions, 3).join(`. `),
  duration: generateRandomNumber(180, 60),
  type: getRandomValue(Array.from(types)),
  season: generateRandomNumber(11, 1),
  episodes: generateRandomNumber(25, 1),
  genre: getRandomValue(Array.from(genres)),
  restrictions: getRandomValue(Array.from(restrictions)),
  premiere: Date.now() + generateRandomNumber(Time.YEAR + 1, -Time.YEAR * 100) * Time.DAY * Time.HOUR * Time.MINUTE * Time.SECOND,
  dvd: Date.now() + generateRandomNumber(Time.YEAR + 1, -Time.YEAR * 10) * Time.DAY * Time.HOUR * Time.MINUTE * Time.SECOND,
  userRating: generateRandomNumber(11, 1),
  rating: generateRandomNumber(11, 1),
  country: getRandomValue(Array.from(countries)),
  isFavorite: generateRandomBoolean(),
  isViewed: generateRandomBoolean(),
  isGoingToWatch: generateRandomBoolean()
});
