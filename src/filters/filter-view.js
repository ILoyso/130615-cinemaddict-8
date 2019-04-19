import Component from '../utils/component';
import {HIDDEN_CLASS} from '../utils/utils';

/** Class representing a filter */
export default class FilterView extends Component {

  /**
   * Create filter
   * @param {Object} filter
   */
  constructor(filter) {
    super();

    this._name = filter.name;
    this._id = this._name.toLowerCase();
    this._isActive = filter.isActive ? true : false;
    this._isAdditional = filter.isAdditional ? true : false;

    this._element = null;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Setter for filtering
   * @param {Function} fn
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Getter for filter id
   * @return {String}
   */
  get filterId() {
    return this._id;
  }

  /**
   * Getter for filter template
   * @return {string}
   */
  get template() {
    return `<a href="#${this._id}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``} ${this._isAdditional ? `
  main-navigation__item--additional` : ``}">
${this._name}
        <span class="main-navigation__item-count ${this._isActive || this._isAdditional ? HIDDEN_CLASS : ``}"></span>
    </a>`;
  }

  /**
   * Method for check for function and if yes to white it in this._onFilter
   * @param {Event} evt
   * @private
   */
  _onFilterClick(evt) {
    evt.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  /** Method for bing functions to filter */
  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  /**
   * Method for setting films count
   * @param {Number} count
   */
  setFilterCount(count) {
    this._element.querySelector(`.main-navigation__item-count`).textContent = `${count}`;
  }

  /** Method for unbind functions from filter */
  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }

  /**
   * Method for update filter
   * @param {Object} filter
   */
  update(filter) {
    this._isActive = filter.isActive;
  }
}
