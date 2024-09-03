import React from 'react';
import './dropd.css'; // Optional: Add CSS for styling if needed

const DropD = (props) => {
  const changeHandler = (event) => {
    props.onSelect(event.target.value);
  };

  return (
    <div className="dropdown">
      <label htmlFor={props.id}>{props.label}</label>
      <select id={props.id} value={props.value} onChange={changeHandler}>
        <option value="">Select a blood type</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropD;