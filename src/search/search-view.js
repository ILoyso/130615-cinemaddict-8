import Component from '../utils/component';

/** Class representing a search */
export default class SearchView extends Component {

  /** Create search component */
  constructor() {
    super();

    this._element = null;
    this._onSearch = null;
    this._onInputSearch = this._onInputSearch.bind(this);
  }

  /**
   * Setter for function that will be work on searching
   * @param {Function} fn
   */
  set onSearch(fn) {
    this._onSearch = fn;
  }

  /**
   * Getter for input element
   * @return {Node}
   */
  get input() {
    return this._element.querySelector(`.search__field`);
  }

  /**
   * Getter for search template
   * @return {string}
   */
  get template() {
    return `<form class="header__search search">
    <input type="text" name="search" class="search__field" placeholder="Search">
    <button type="submit" class="visually-hidden">Search</button>
  </form>`;
  }

  /**
   * Method for searching
   * @private
   */
  _onInputSearch() {
    if (typeof this._onSearch === `function`) {
      this._onSearch();
    }
  }

  /** Method for bing functions to search */
  bind() {
    this._element.querySelector(`.search__field`).addEventListener(`keyup`, this._onInputSearch);
  }

  /** Method for clear search field */
  clear() {
    this._element.querySelector(`.search__field`).value = ``;
  }

  /** Method for unbind functions from search */
  unbind() {
    this._element.querySelector(`.search__field`).removeEventListener(`keyup`, this._onInputSearch);
  }
}
