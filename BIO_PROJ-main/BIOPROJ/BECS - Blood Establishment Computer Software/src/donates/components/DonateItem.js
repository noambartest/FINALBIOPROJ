import React from "react";
import Card from "../../shared/UIElements/Card";
import "./DonateItem.css";

const DonateItem = (props) => {
  return (
    <li className="donate-item">
      <Card className="donate-item__content">
        <div className="donate-item__info">
          <h3 className="donate-item__btype">{props.btype}</h3>
          <p className="donate-item__date">Date: {`${props.date.day}/${props.date.month}/${props.date.year}`}</p>
          <p className="donate-item__id">Serial Number: {props.id}</p>
          <p className="donate-item__care">Care Provider: {props.careP}</p>
          <p className="donate-item__mental-health">Mental Health Condition: {props.mentalHealthCondition}</p>
          <p className="donate-item__credit-card">Credit Card: {props.creditCard}</p>
        </div>
      </Card>
    </li>
  );
};

export default DonateItem;