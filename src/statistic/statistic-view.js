import Component from '../utils/component';
import {createElement, isNumeric} from '../utils/utils';
import moment from 'moment';
import 'moment-duration-format';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;


/** Class representing a statistic */
export default class StatisticView extends Component {

  /**
   * Create statistic
   * @param {Object} films
   */
  constructor(films) {
    super();

    this._films = films;
    this._watchedFilms = this._films.filter((film) => film.userInfo.isViewed);
    this._filteringFilms = this._watchedFilms;
    this._chart = null;

    this._onFilterByTimeClick = this._onFilterByTimeClick.bind(this);
  }

  /**
   * Getter for statistic template
   * @return {string}
   */
  get template() {
    return `<section class="statistic">
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>
    
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
    
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text statistic__item-text--watched">${this._getWatchedFilmsTemplate()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text statistic__item-text--duration">${this._getFilmsDurationTemplate()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text statistic__item-text--genres">${this._getTopGenresTemplate()}</p>
        </li>
      </ul>
    
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    
    </section>`;
  }


  /**
   * Method for filtering films by time
   * @private
   */
  _onFilterByTimeClick() {
    const filter = this._element.querySelector(`.statistic__filters-input:checked`).value;

    switch (filter) {
      case `all-time`:
        this._filteringFilms = this._watchedFilms;
        break;
      case `today`:
        this._filteringFilms = this._watchedFilms.filter((film) => moment(film.userInfo.date).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));
        break;
      case `week`:
        this._filteringFilms = this._watchedFilms.filter((film) => moment(film.userInfo.date) > moment().subtract(1, `w`));
        break;
      case `month`:
        this._filteringFilms = this._watchedFilms.filter((film) => moment(film.userInfo.date) > moment().subtract(1, `months`));
        break;
      case `year`:
        this._filteringFilms = this._watchedFilms.filter((film) => moment(film.userInfo.date) > moment().subtract(1, `y`));
        break;
    }

    this._onUpdateDate();
  }

  /**
   * Method for filtering by genres
   * @return {Array[]}
   * @private
   */
  _filterByGenre() {
    const filteredFilms = {};

    this._filteringFilms.forEach((film) => {
      Array.from(film.filmInfo.genres).map((genre) => {
        filteredFilms[genre] = isNumeric(filteredFilms[genre]) ? filteredFilms[genre] + 1 : 1;
      });
    });

    const genres = Object.keys(filteredFilms);
    const genresCount = Object.values(filteredFilms);

    return [genres, genresCount];
  }

  /**
   * Method for generate chart
   * @private
   */
  _generateCharts() {
    const [genreLabels, genreAmounts] = this._filterByGenre();
    const statisticWrapper = this._element.querySelector(`.statistic__chart`);
    statisticWrapper.height = BAR_HEIGHT * genreLabels.length;

    this._chart = new Chart(statisticWrapper, this._getChart());

    this._chart.data = {
      labels: genreLabels,
      datasets: [{
        data: genreAmounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    };

    this._chart.update();
  }

  /**
   * Method for generate chart properties
   * @private
   * @return {Object}
   */
  _getChart() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };
  }

  /**
   * Method for films duration template
   * @return {String}
   * @private
   */
  _getFilmsDurationTemplate() {
    const totalDuration = this._filteringFilms.reduce((duration, film) => duration + film.filmInfo.duration, 0);
    return `${moment.duration(totalDuration).format(`h`)} <span class="statistic__item-description">h</span> ${moment.duration(totalDuration).minutes()} <span class="statistic__item-description">m</span>`;
  }

  /**
   * Method for top genres template
   * @return {String}
   * @private
   */
  _getTopGenresTemplate() {
    const [genreLabels, genreAmounts] = this._filterByGenre();
    const max = Math.max(...genreAmounts);
    const maxID = genreAmounts.indexOf(max);

    return `${genreLabels[maxID] ? genreLabels[maxID] : `-`}`;
  }

  /**
   * Method for watched films template
   * @return {String}
   * @private
   */
  _getWatchedFilmsTemplate() {
    return `${this._filteringFilms.length} <span class="statistic__item-description">movie${this._filteringFilms.length === 1 ? `` : `s`}</span>`;
  }

  /**
   * Method for update
   * @private
   */
  _onUpdateDate() {
    this._chart.destroy();
    this._generateCharts();
    this._element.querySelector(`.statistic__item-text--watched`).innerHTML = this._getWatchedFilmsTemplate();
    this._element.querySelector(`.statistic__item-text--duration`).innerHTML = this._getFilmsDurationTemplate();
    this._element.querySelector(`.statistic__item-text--genres`).innerHTML = this._getTopGenresTemplate();
  }

  /** Method for bing functions to statistic */
  bind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.addEventListener(`click`, this._onFilterByTimeClick);
    });
  }

  /**
   * Method for render statistic
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    this._generateCharts();
    return this._element;
  }

  /** Method for unbind functions from statistic */
  unbind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.removeEventListener(`click`, this._onFilterByTimeClick);
    });
  }
}
