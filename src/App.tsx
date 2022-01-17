import './App.scss';
import { useEffect, useState } from 'react';
import DayField from './components/DayField/DayField';
import Select from './components/Select/Select';
import { timesheetGenerator, EmployeeType, getWeeks } from './utils/timesheetGenerator/timesheetGenerator';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const App = () => {
  const [employeesData, setEmployeesData] = useState<EmployeeType[]>([]);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<EmployeeType>();
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [salaryLoading, setSalaryLoading] = useState<boolean>(false);

  useEffect(() => {
    setEmployeesData(timesheetGenerator(50));
  }, []);

  useEffect(() => {
    setSalaryLoading(true);

    setTimeout(() => {
      setSalaryLoading(false);
    }, Math.floor(Math.random() * (1000 - 250)) + 250);
  }, [selectedEmployeeName, employeesData, selectedWeek]);

  useEffect(() => {
    const employeeData = employeesData.find(({ name }) => name === selectedEmployeeName);

    if (employeeData) {
      setSelectedEmployeeData(employeeData);
    }
  }, [selectedEmployeeName]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const weekTimesheet = selectedEmployeeData?.timesheet.find(({ week }) => week === selectedWeek);

  const hoursWorked = (): number => {
    if (weekTimesheet) {
      return Object
        .values(weekTimesheet.weekdays)
        .reduce((previousValue, currentValue) => previousValue + currentValue);
    }
    return 0;
  };

  const weeksSalary = ():number => {
    if (weekTimesheet && selectedEmployeeData) {
      const salaryPerDay = Object.entries(weekTimesheet.weekdays).map((day) => {
        if (day[0] === 'saturday' || day[0] === 'sunday') {
          return day[1] * selectedEmployeeData.hourlyRate * 2;
        }
        return day[1] * selectedEmployeeData.hourlyRate;
      });
      return salaryPerDay.reduce((previousValue, currentValue) => previousValue + currentValue);
    }
    return 0;
  };

  const changeHours = (day: string, hours: number) => {
    if (selectedEmployeeData && weekTimesheet) {
      const indexOfSelectedEmployee = employeesData.indexOf(selectedEmployeeData);
      const indexOfSelectedEmployeeTimesheet = employeesData[indexOfSelectedEmployee].timesheet.indexOf(weekTimesheet);

      const dataOfEmployees = [...employeesData];

      dataOfEmployees[indexOfSelectedEmployee].timesheet[indexOfSelectedEmployeeTimesheet].weekdays[day] = hours;

      setEmployeesData(dataOfEmployees);
    }
  };

  const workedHoursInADay = (day: string): number => (weekTimesheet ? weekTimesheet.weekdays[day.toLowerCase()] : 0);

  const daysSalary = (day: string): number => {
    if (selectedEmployeeData) {
      let salary = workedHoursInADay(day) * selectedEmployeeData.hourlyRate;

      if (day === 'saturday' || day === 'sunday') {
        salary = workedHoursInADay(day) * selectedEmployeeData.hourlyRate * 2;
      }

      return salary;
    }
    return 0;
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
          {
            weekdays.map((day) => (
              <DayField
                key={day}
                week={selectedWeek}
                employeeName={selectedEmployeeName}
                salary={daysSalary(day.toLowerCase())}
                changeHrs={changeHours}
                day={day}
                hours={workedHoursInADay(day.toLowerCase())}
              />
            ))
          }
        </div>
      </main>
      <footer className="footer">
        <div className="footer__text-box">
          <span>Hours worked</span>
          <span>{ hoursWorked() }</span>
        </div>
        <div className="footer__text-box">
          <span>Salary</span>
          {
            salaryLoading && weeksSalary() !== 0 ? (<LoadingSpinner />) : (
              <span>
                €
                {' '}
                { weeksSalary().toFixed(2) }
              </span>
            )
          }
        </div>
      </footer>
    </div>
  );
};

export default App;
