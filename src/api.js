import ModelFilm from './utils/model-film';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


/**
 * Function for check if response from server is Ok (200-300)
 * @param {Response} response
 * @return {*}
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


/**
 * Function for check that data from server is json
 * @param {Response} response
 * @return {Promise<json>}
 */
const toJSON = (response) => {
  return response.json();
};


/**
 * Class representing a API for working with server
 * @type {API}
 */
export default class API {

  /**
   * Create api for working with server
   * @param {String} endPoint - server url
   * @param {String} authorization
   */
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Method for load data
   * @param {String} url
   * @param {String} method
   * @param {Body} body
   * @param {Headers} headers
   * @return {Promise<Response>}
   * @private
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Method for getting films from server
   * @return {Promise<Response>}
   */
  getFilms() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelFilm.parseFilms);
  }

  /**
   * Method for sync data between server and localstorage
   * @param {Object[]} films
   * @return {Promise<Response | never>}
   */
  syncFilms(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  /**
   * Method for update film on server
   * @param {Number} id
   * @param {Object} data
   * @return {Promise<Response>}
   */
  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }
}
