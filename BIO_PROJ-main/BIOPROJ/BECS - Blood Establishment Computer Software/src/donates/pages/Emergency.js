import React, { useCallback, useReducer, useState } from "react";
import Button from "../../shared/FormElements/Button";
import DonateItems from "../components/DonateItems";
import { Link } from "react-router-dom";
import "./Emergency.css";
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

const NewDe = (props) => {
  const [formState, dispatch] = useReducer(formReducer, {
    bloodType: "",
    numDonations: "",
  });
  const [listState, setListState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notEnoughDonations, setNotEnoughDonations] = useState(false);

  // Handler for input changes
  const inputHandler = useCallback((id, value, isValid) => {
    console.log("Input change:", id, value, isValid);
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
    });
  }, []);

  const searchHandler = async () => {
    console.log("Selected blood type:", formState.bloodType);
    console.log("Number of donations needed:", formState.numDonations);
    setLoading(true);
    setNotEnoughDonations(false);
    try {
      const response = await fetch("http://localhost:5000/api/donates/O-");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API response data:", data); // Debug API response
      console.log("type is " + typeof data); // 'object'
      console.log(Array.isArray(data)); // true if data is an array, false if it's an object
      console.log(data.donates);

      // Limit the number of donations to the number needed
      const limitedDonations = data.donates.slice(0, formState.numDonations);
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

  if (props.role === "admin" || props.role === "user") {
    return (
      <form className="search-form">
        <div>
          <label htmlFor="numDonations">Number of Donations Needed:</label>
          <input
            id="numDonations"
            type="number"
            value={formState.numDonations}
            onChange={(event) =>
              inputHandler("numDonations", event.target.value, true)
            }
          />
        </div>
        <Button
          type="button"
          onClick={searchHandler}
          disabled={!formState.numDonations}
        >
          Search
        </Button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {notEnoughDonations ? (
              <p>
                Not enough donations available.
                <Link to="/donates/newDonation" className="button">
                  Add Donation
                </Link>
              </p>
            ) : (
              <DonateItems items={listState} />
            )}
          </>
        )}
      </form>
    );
  } else {
    return <NotAllowedMessage />;
  }
};

export default NewDe;
