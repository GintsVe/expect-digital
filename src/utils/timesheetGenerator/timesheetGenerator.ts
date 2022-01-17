import moment from 'moment';
import names from '../../data/names';

export type TimesheetType = {
  week: string,
  weekdays: {
    [key: string]: number,
  }
}

export type EmployeeType = {
  name: string,
  hourlyRate: number,
  timesheet: TimesheetType[]
}

export const getWeeks = () => {
  const allWeeks = [];
  const startOfThisWeek = moment().startOf('isoWeek');
  const endOfThisWeek = moment().endOf('isoWeek');

  for (let x = 0; x < 5; x += 1) {
    const startOfWeek = startOfThisWeek.add((x === 0 ? 0 : -7), 'day').format('D MMM YYYY');
    const endOfWeek = endOfThisWeek.add((x === 0 ? 0 : -7), 'day').format('D MMM YYYY');

    allWeeks.push(`${startOfWeek} - ${endOfWeek}`);
  }

  return allWeeks;
};

const randomUniqueNumbers = (amount: number, min: number, max: number) => {
  const numbers = [];
  while (numbers.length < amount) {
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    if (numbers.indexOf(randomNumber) === -1) numbers.push(randomNumber);
  }
  return numbers;
};

export const timesheetGenerator = (amount: number) => {
  const employeesData = [];
  const number = randomUniqueNumbers(amount, 0, names.length);

  const randomIntegerFrom5To40 = () => Math.floor(Math.random() * 36) + 5;
  const randomIntegerFrom0To8 = () => Math.floor(Math.random() * 9);

  for (let x = 0; x < amount; x += 1) {
    const timeSheet = [];

    for (let y = 0; y < getWeeks().length; y += 1) {
      timeSheet.push({
        week: getWeeks()[y],
        weekdays: {
          monday: randomIntegerFrom0To8(),
          tuesday: randomIntegerFrom0To8(),
          wednesday: randomIntegerFrom0To8(),
          thursday: randomIntegerFrom0To8(),
          friday: randomIntegerFrom0To8(),
          saturday: randomIntegerFrom0To8(),
          sunday: randomIntegerFrom0To8(),
        },
      });
    }

    employeesData.push(
      {
        name: names[number[x]],
        hourlyRate: randomIntegerFrom5To40(),
        timesheet: timeSheet,
      },
    );
  }

  return employeesData;
};
