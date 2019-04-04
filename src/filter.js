import Component from "./component";

/** Class representing a filter */
export default class Filter extends Component {

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
    const amountTemplate = `<span class="main-navigation__item-count">n</span>`;

    return `<a href="#${this._id}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``} ${this._isAdditional ? `
  main-navigation__item--additional` : ``}">
${this._name}
            ${this._isActive || this._isAdditional ? `` : amountTemplate}
          </a>`;
  }

  /** Method for bing functions to filter */
  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
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
