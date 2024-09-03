import React from "react";

const DateDropDownSelection = ({ label, formData, dateObjName, handleDateChange }) => {
  
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  };

  const generateDays = () => Array.from({ length: 31 }, (_, i) => i + 1);
  
  const generateMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <label>{label}:</label>
      <div className="birthdate-group">
        <div className="birthdate-select">
          <label htmlFor={`${dateObjName}.day`}>Day:</label>
          <select
            id={`${dateObjName}.day`}
            value={formData[dateObjName].day}
            onChange={handleDateChange}
            name={`${dateObjName}.day`}
          >
            {generateDays().map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="birthdate-select">
          <label htmlFor={`${dateObjName}.month`}>Month:</label>
          <select
            id={`${dateObjName}.month`}
            value={formData[dateObjName].month}
            onChange={handleDateChange}
            name={`${dateObjName}.month`}
          >
            {generateMonths().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="birthdate-select">
          <label htmlFor={`${dateObjName}.year`}>Year:</label>
          <select
            id={`${dateObjName}.year`}
            value={formData[dateObjName].year}
            onChange={handleDateChange}
            name={`${dateObjName}.year`}
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default DateDropDownSelection;