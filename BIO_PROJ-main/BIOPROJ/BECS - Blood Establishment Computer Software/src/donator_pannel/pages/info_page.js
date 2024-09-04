import React from "react";
import { useHistory } from "react-router-dom"; // Ensure this import is correct
import DonatorInfo from "../components/DonatorInfo";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min"; // Ensure this import is correct

const InfoPage = (props) => {
  const history = useHistory(); // Correctly initialize history here

  const handleLogout = () => {
    props.logOut();  // Ensure this function is correctly passed from the parent component
    history.push("/");  // Correct usage of history.push to navigate
  };

  console.log('this is InfoPage');
  return (
    <>
      <DonatorInfo />
      <button onClick={handleLogout}>Logout</button>
      
    </>
  );
};

export default InfoPage;
