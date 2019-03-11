import {createElement} from "./utils";

/** Abstract class representing a component */
export default class Component {

  /**
   * Create an abstract component and check that we can't create an instantiate Component
   */
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
    this.state = {};
  }

  /**
   * Getter for DOM element (if it is)
   * @return {Node}
   */
  get element() {
    return this._element;
  }

  /**
   * Getter for task template, should return String
   */
  get template() {
    throw new Error(`You have to define template.`);
  }

  /** Method for bing functions to this component */
  bind() {}

  /**
   * Method for render this component and add events
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbing functions from this component */
  unbind() {}

  /** Method for unrender this component */
  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }
}
