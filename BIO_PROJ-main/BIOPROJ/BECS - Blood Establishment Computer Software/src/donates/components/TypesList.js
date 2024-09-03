import React from "react";

import "./TypesList.css";
import SingleType from "./SingleType";

const TypesList = (props) => {

  console.log('-------------------------------------------------------------------------------------------');
  console.log(props);
  console.log('-------------------------------------------------------------------------------------------');
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No Donates Found</h2>;
      </div>
    );
  }

  return (
    <ul className="types-list">
      {props.items.map((single_type) => {
        return (
          <SingleType
            name={single_type.btype}
            donatesCount={single_type.count}
            role={props.role}
          />
        );
      })}
    </ul>
  );
};

export default TypesList;
