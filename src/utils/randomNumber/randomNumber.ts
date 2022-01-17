export const randomNumber = (max: number, min: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const randomUniqueNumbers = (amount: number, min: number, max: number) => {
  const numbers = [];

  while (numbers.length < amount) {
    const number = randomNumber(max, min);
    if (numbers.indexOf(number) === -1) numbers.push(number);
  }

  return numbers;
};
