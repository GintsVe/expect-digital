import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import { format } from 'date-fns';
import names from '../../data/names';
import weekdays from '../../data/weekdays';
import { randomNumber, randomUniqueNumbers } from '../randomNumber/randomNumber';

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
  const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

  for (let x = 0; x < 5; x += 1) {
    const startOfPreviousWeek = format(addDays(startOfThisWeek, -7 * x), 'd MMM yyyy');
    const endOfPreviousWeek = format(addDays(endOfThisWeek, -7 * x), 'd MMM yyyy');

    allWeeks.push(`${startOfPreviousWeek} - ${endOfPreviousWeek}`);
  }

  return allWeeks;
};

export const timesheetGenerator = (amount: number): EmployeeType[] => {
  const employeesData = [];
  const numbers = randomUniqueNumbers(amount, 0, names.length);

  for (let x = 0; x < amount; x += 1) {
    const timeSheet = [];

    for (let y = 0; y < getWeeks().length; y += 1) {
      const daysAndHours = {};

      weekdays.forEach((day) => {
        Object.assign(daysAndHours, { [day]: randomNumber(8, 0) });
      });

      timeSheet.push({
        week: getWeeks()[y],
        weekdays: daysAndHours,
      });
    }

    employeesData.push(
      {
        name: names[numbers[x]],
        hourlyRate: randomNumber(40, 5),
        timesheet: timeSheet,
      },
    );
  }

  return employeesData;
};
