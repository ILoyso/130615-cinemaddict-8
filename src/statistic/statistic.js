import StatisticView from './statistic-view';

const main = document.querySelector(`.main`);

/**
 * Function for show statistic
 * @param {Object[]} films
 */
export const showStatistic = (films) => {
  const statisticComponent = new StatisticView(films);
  main.appendChild(statisticComponent.render());
};


/** Function for hide statistic */
export const hideStatistic = () => {
  if (document.querySelector(`.statistic`)) {
    main.removeChild(document.querySelector(`.statistic`));
  }
};
