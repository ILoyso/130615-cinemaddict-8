// Random number - not including max value
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

// Render template befor parent first child
export const renderTemplate = (parent, template) => {
  parent.insertAdjacentHTML(`afterbegin`, template);
};
