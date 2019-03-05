// Random number - not including max value
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateRandomBoolean = () => generateRandomNumber(2) === 0;

export const getRandomValue = (values) => values[generateRandomNumber(values.length)];

export const getRandomArrayElements = (array, amount) => {
  let newArray = [];

  while (amount > 0) {
    newArray.push(array[generateRandomNumber(array.length)]);
    amount--;
  }
  return newArray;
};

// Render template befor parent first child
export const renderTemplate = (parent, template) => {
  parent.insertAdjacentHTML(`afterbegin`, template);
};

export const Time = {
  YEAR: 365,
  DAY: 24,
  HOUR: 60,
  MINUTE: 60,
  SECOND: 1000
};
