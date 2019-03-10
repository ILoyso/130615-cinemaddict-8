/**
 * Function for make filter template
 * @param {String} text
 * @param {Number} amount
 * @param {Boolean} isActive
 * @param {Boolean} isAdditional
 * @return {string}
 */
export default (text, amount, isActive = false, isAdditional = false) => {
  const filterId = text.toLowerCase().split(` `)[0];
  const amountTemplate = `<span class="main-navigation__item-count">${amount}</span>`;

  return `<a href="#${filterId}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``} ${isAdditional ? `main-navigation__item--additional` : ``}">
            ${text}
            ${isActive ? `` : amountTemplate}
          </a>`;
};

