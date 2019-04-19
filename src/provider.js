import ModelFilm from './utils/model-film';

/**
 * Function for convert object to array
 * @param {Object} object
 * @return {Array}
 */
const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};


/** Class for organize work API with Store (and localStorage) */
export default class Provider {

  /**
   * Create a provider
   * @param {Object} api
   * @param {Object} store
   */
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  /**
   * Method for check if internet connect or not
   * @return {Boolean}
   * @private
   */
  _isOnline() {
    return window.navigator.onLine;
  }

  /**
   * Method for getting films from server or from localStorage (if offline)
   * @return {Promise}
   */
  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((film) => this._store.setItem({key: film.id, item: film.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelFilm.parseFilms(rawFilms);

      return Promise.resolve(films);
    }
  }

  /**
   * Method for sync data between server and localstorage
   * @return {*|Promise<Response|never>}
   */
  syncFilms() {
    return this._api.syncFilms(objectToArray(this._store.getAll()));
  }

  /**
   * Method for update film on server or on localStorage (if offline)
   * @return {Promise}
   */
  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(ModelFilm.parseFilm(film));
    }
  }
}
