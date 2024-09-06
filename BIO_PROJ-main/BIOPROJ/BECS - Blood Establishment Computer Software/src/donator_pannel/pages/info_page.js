import React, { useEffect, useState } from "react";
import axios from "axios";
import "./info_page.css";

const InfoPage = ({ id, logOut }) => {
  console.log("infopage");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logOutHandler = () => {
    logOut();
    console.log("logOutHandler");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
        ); // Adjust the API endpoint as needed
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading user data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!userData) {
    return <p className="error">No user data available.</p>;
  }

  const { username, name, birth_date, ID, aiFeatures, aiResults } = userData;

  return (
    <div className="info-page">
      <h2>Donator Panel</h2>

      {/* User Information */}
      <div className="user-info">
        <h3>User Information</h3>
        <p>
          <strong>Username:</strong> {username}
        </p>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Birth Date:</strong>{" "}
          {`${birth_date.day}/${birth_date.month}/${birth_date.year}`}
        </p>
        <p>
          <strong>ID:</strong> {ID}
        </p>
      </div>

      {/* AI Features */}
      <div className="ai-features">
        <h3>Blood Test Result</h3>
        {aiFeatures ? (
          <ul>
            <li>
              <strong>Age:</strong> {aiFeatures.age}
            </li>
            <li>
              <strong>Gender:</strong>{" "}
              {aiFeatures.sex === 0 ? "Female" : "Male"}
            </li>
            <li>
              <strong>Chest Pain Type (CP):</strong> {aiFeatures.cp}
            </li>
            <li>
              <strong>Resting Blood Pressure (trestbps):</strong>{" "}
              {aiFeatures.trestbps}
            </li>
            <li>
              <strong>Cholesterol (chol):</strong> {aiFeatures.chol}
            </li>
            <li>
              <strong>Fasting Blood Sugar (fbs):</strong> {aiFeatures.fbs}
            </li>
            <li>
              <strong>Resting ECG (restecg):</strong> {aiFeatures.restecg}
            </li>
            <li>
              <strong>Max Heart Rate (thalach):</strong> {aiFeatures.thalach}
            </li>
            <li>
              <strong>Exercise Induced Angina (exang):</strong>{" "}
              {aiFeatures.exang}
            </li>
          </ul>
        ) : (
          <p>No AI Features available.</p>
        )}
      </div>

      {/* AI Results */}
      <div className="ai-results">
        <h3>AI Results</h3>
        {aiResults && aiResults.prediction !== null ? (
          <>
            <p>
              <strong>Message:</strong> {aiResults.message}
            </p>
          </>
        ) : (
          <p>No AI Results available.</p>
        )}
      </div>

      <div className="button-container">
        <button onClick={logOutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default InfoPage;
