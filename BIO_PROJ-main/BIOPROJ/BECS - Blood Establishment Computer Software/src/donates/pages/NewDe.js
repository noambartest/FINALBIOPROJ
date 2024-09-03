import React, { useCallback, useReducer, useState } from "react";
import DropD from "../../shared/FormElements/dropd/dropd";
import Button from "../../shared/FormElements/Button";
import DonateItems from "../components/DonateItems";
import { Link } from 'react-router-dom';
import NotAllowedMessage from "../components/NotAllowedMessage";


// Reducer function for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.inputId]: action.value,
      };
    default:
      return state;
  }
};

// Compatibility data
const bloodTypeCompatibility = {
  "A+": { donateTo: ["A+", "AB+"], receiveFrom: ["A+", "A-", "O+", "O-"] },
  "O+": { donateTo: ["O+", "A+", "B+", "AB+"], receiveFrom: ["O+", "O-"] },
  "B+": { donateTo: ["B+", "AB+"], receiveFrom: ["B+", "B-", "O+", "O-"] },
  "AB+": { donateTo: ["AB+"], receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  "A-": { donateTo: ["A+", "A-", "AB+", "AB-"], receiveFrom: ["A-", "O-"] },
  "O-": { donateTo: ["Everyone"], receiveFrom: ["O-"] },
  "B-": { donateTo: ["B+", "B-", "AB+", "AB-"], receiveFrom: ["B-", "O-"] },
  "AB-": { donateTo: ["AB+", "AB-"], receiveFrom: ["AB-", "A-", "B-", "O-"] },
};

// Population percentage data
const bloodTypePercentages = {
  "O+": 32.0,
  "A+": 34.0,
  "B+": 17.0,
  "AB+": 7.0,
  "A-": 5.0,
  "O-": 2.0,
  "B-": 2.0,
  "AB-": 1.0,
};

const NewDe = (props) => {

  console.log("newDE");

  const [formState, dispatch] = useReducer(formReducer, {
    bloodType: "",
    numDonations: ""
  });
  const [listState, setListState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notEnoughDonations, setNotEnoughDonations] = useState(false);

  // Handler for input changes
  const inputHandler = useCallback((id, value, isValid) => {
    console.log('Input change:', id, value, isValid);
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value
    });
  }, []);

  const searchHandler = async () => {
    console.log("Selected blood type:", formState.bloodType);
    console.log("Number of donations needed:", formState.numDonations);
    setLoading(true);
    setNotEnoughDonations(false);
    try {
      const response = await fetch("http://localhost:5000/api/donates/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API response data:", data); // Debug API response
      console.log("type is " + typeof data); // 'object'
      console.log(Array.isArray(data)); // true if data is an array, false if it's an object
      console.log(data.donates);

      // Get compatible blood types for the selected blood type
      const compatibleTypes = bloodTypeCompatibility[formState.bloodType].receiveFrom;
      console.log("Compatible blood types:", compatibleTypes); // Debug compatibility types

      // Ensure blood type matching is correct (case sensitivity and trimming spaces)
      const filteredDonations = data.donates.filter(donation => {
        if (donation.btype) {
          const donorBloodType = donation.btype.trim().toUpperCase();
          return compatibleTypes.includes(donorBloodType);
        }
        return false;
      });
      console.log("Filtered donations:", filteredDonations); // Debug filtered donations

      // Optionally, sort by population percentage
      filteredDonations.sort((a, b) => {
        return bloodTypePercentages[b.btype] - bloodTypePercentages[a.btype];
      });
      console.log("Sorted donations:", filteredDonations); // Debug sorted donations

      // Limit the number of donations to the number needed
      const limitedDonations = filteredDonations.slice(0, formState.numDonations);
      console.log("Limited donations:", limitedDonations); // Debug limited donations

      // Check if there are not enough donations
      if (limitedDonations.length < formState.numDonations) {
        setNotEnoughDonations(true);
      }

      // Introduce a delay before setting the state
      setTimeout(() => {
        setListState(limitedDonations);
        setLoading(false);
      }, 1000); // 1000 milliseconds (1 second) delay

    } catch (error) {
      console.error("Error during fetch:", error);
      setLoading(false);
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];


  if (props.role === "admin" || props.role === "user") {
    return (
      <form className="search-form">
        <DropD
          id="bloodType"
          label="Blood Type"
          options={bloodTypes}
          value={formState.bloodType}
          onSelect={(value) => inputHandler('bloodType', value, true)}
        />
        <div>
          <label htmlFor="numDonations">Number of Donations Needed:</label>
          <input
            id="numDonations"
            type="number"
            value={formState.numDonations}
            onChange={(event) => inputHandler('numDonations', event.target.value, true)}
          />
        </div>
        <Button type="button" onClick={searchHandler} disabled={!formState.bloodType || !formState.numDonations}>
          Search
        </Button>
        {loading ? <p>Loading...</p> : (
          <>
            {notEnoughDonations ? (
              <p>Not enough donations available.
                <Link to="/donates/newDonation" className="button">Add Donation</Link>
              </p>
              
            ) : (
              <DonateItems items={listState} />
            )}
          </>
        )}
      </form>
    );
  } else {
    console.log("i am ");
    return <NotAllowedMessage />;
  }
  
};

export default NewDe;


