import React, { FC, useEffect, useState } from 'react';
import './DayField.scss';
import { useDetectClickOutside } from 'react-detect-click-outside';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

type DayFieldsProps = {
  day: string,
  hours: number,
  changeHrs: (day: string, hours: number) => void,
  salary: number,
  employeeName: string,
  week: string,
}

const DayField:FC<DayFieldsProps> = ({
  day, hours, changeHrs, salary, employeeName, week,
}) => {
  const [inputValue, setInputValue] = useState<number>(hours);
  const [changeHours, setChangeHours] = useState<boolean>(false);
  const [salaryLoading, setSalaryLoading] = useState<boolean>(false);

  useEffect(() => {
    if (hours !== 0 || salary !== 0) {
      setSalaryLoading(true);
    }

    setTimeout(() => {
      setSalaryLoading(false);
    }, Math.floor(Math.random() * (1000 - 250)) + 250);
  }, [hours, salary, employeeName, week]);

  const closeInput = () => {
    setChangeHours(false);
  };

  const ref = useDetectClickOutside({ onTriggered: closeInput });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value >= 0 && +e.target.value <= 24) {
      setInputValue(+e.target.value);
    }
  };

  const changeHoursHandler = () => {
    changeHrs(day.toLowerCase(), inputValue);
    setChangeHours(false);
  };

  const openHoursEditor = () => {
    setChangeHours(true);
    setInputValue(hours);
  };

  return (
    <div className="day-field-wrapper">
      <div className="field-wrapper">
        <fieldset
          ref={ref}
          onTouchEnd={openHoursEditor}
          onDoubleClick={openHoursEditor}
          className="field"
        >
          <legend className="title">{day}</legend>
          {
            !changeHours
              ? <span className="hours">{hours}</span>
              : (
                <input
                  className="input"
                  type="number"
                  onChange={inputChangeHandler}
                  value={inputValue}
                />
              )
          }
        </fieldset>
        {
          changeHours
          && (
            <button
              onClick={changeHoursHandler}
              className="button"
              type="button"
            >
              Save
            </button>
          )
        }
      </div>
      <div>
        {
          salaryLoading ? <LoadingSpinner />
            : (
              <span className="salary">
                €
                {
                  salary.toFixed(2)
                }
              </span>
            )
        }
      </div>
    </div>
  );
};

export default DayField;
