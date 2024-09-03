import React from "react";
import DonateItem from "./DonateItem";
import { Link } from "react-router-dom";
import Card from "../../shared/UIElements/Card";
import "./DonateItems.css";

const DonateItems = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="donate-list center">
        <Card className="donate-list__empty">
          <h2>No donations available.</h2>
          <Link to="/donates/newDonation" className="donate-list__add-button">
            Add Donation
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="donate-list__container">
      <ul className="donate-list">
        {props.items.map((donate) => (
          <DonateItem
            key={donate._id} // Adding a key prop
            id={donate._id}
            date={donate.donateDate}
            btype={donate.btype}
            careP={donate.careProvided}
            mentalHealthCondition={donate.mentalHealthCondition}
            creditCard={donate.creditCard}
          />
        ))}
      </ul>
    </div>
  );
};

export default DonateItems;