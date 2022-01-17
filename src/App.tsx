import './App.scss';
import { useEffect, useState } from 'react';
import DayField from './components/DayField/DayField';
import Select from './components/Select/Select';
import {
  EmployeeType, getWeeks, timesheetGenerator,
} from './utils/timesheetGenerator/timesheetGenerator';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import weekdays from './data/weekdays';
import { randomNumber } from './utils/randomNumber/randomNumber';

const App = () => {
  const [employeesData, setEmployeesData] = useState<EmployeeType[]>([]);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<EmployeeType>();
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [salaryLoading, setSalaryLoading] = useState(false);

  useEffect(() => {
    setEmployeesData(timesheetGenerator(10));
  }, []);

  useEffect(() => {
    setSalaryLoading(true);

    setTimeout(() => {
      setSalaryLoading(false);
    }, randomNumber(1000, 250));
  }, [selectedEmployeeName, employeesData, selectedWeek]);

  useEffect(() => {
    const employeeData = employeesData.find(({ name }) => name === selectedEmployeeName);

    if (employeeData) {
      setSelectedEmployeeData(employeeData);
    }
  }, [selectedEmployeeName]);

  const selectedWeekTimesheet = selectedEmployeeData?.timesheet.find(({ week }) => week === selectedWeek);

  const hoursWorked = (): number => {
    if (selectedWeekTimesheet) {
      return Object
        .values(selectedWeekTimesheet.weekdays)
        .reduce((previousValue, currentValue) => previousValue + currentValue);
    }

    return 0;
  };

  const workedHoursInADay = (day: string): number => (
    selectedWeekTimesheet ? selectedWeekTimesheet.weekdays[day] : 0
  );

  const daysSalary = (day: string): number => {
    if (selectedEmployeeData) {
      const salary = workedHoursInADay(day) * selectedEmployeeData.hourlyRate;

      return (day === 'saturday' || day === 'sunday' ? salary * 2 : salary);
    }

    return 0;
  };

  const weeksSalary = ():number => {
    if (selectedWeekTimesheet && selectedEmployeeData) {
      return Object.entries(selectedWeekTimesheet.weekdays)
        .map((day) => daysSalary(day[0]))
        .reduce((previousValue, currentValue) => previousValue + currentValue);
    }

    return 0;
  };

  const changeHours = (day: string, hours: number) => {
    if (selectedEmployeeData && selectedWeekTimesheet) {
      const selectedEmployeeIndex = employeesData.indexOf(selectedEmployeeData);
      const selectedEmployeeTimesheetIndex = employeesData[selectedEmployeeIndex]
        .timesheet
        .indexOf(selectedWeekTimesheet);
      const dataOfEmployees = [...employeesData];

      dataOfEmployees[selectedEmployeeIndex].timesheet[selectedEmployeeTimesheetIndex].weekdays[day] = hours;

      setEmployeesData(dataOfEmployees);
    }
  };

  return (
    <div>
      <header className="header">
        <Select
          list={employeesData.map(({ name }) => name)}
          title="Employee"
          onSelect={(employee: string) => { setSelectedEmployeeName(employee); }}
        />
        <Select
          list={getWeeks()}
          title="Week"
          onSelect={(week: string) => { setSelectedWeek(week); }}
        />
      </header>
      <main className="main">
        <div className="week-timesheet">
          {weekdays.map((day) => (
            <DayField
              key={day}
              week={selectedWeek}
              employeeName={selectedEmployeeName}
              salary={daysSalary(day)}
              changeHrs={changeHours}
              day={day}
              hours={workedHoursInADay(day)}
            />
          ))}
        </div>
      </main>
      <footer className="footer">
        <div className="footer__text-box">
          <span>Hours worked</span>
          <span>{ hoursWorked() }</span>
        </div>
        <div className="footer__text-box">
          <span>Salary</span>
          {salaryLoading && weeksSalary() !== 0 ? (<LoadingSpinner />) : (
            <span>
              €
              {' '}
              { weeksSalary().toFixed(2) }
            </span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
