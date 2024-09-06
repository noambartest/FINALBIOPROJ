import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLogin, onRoleChange }) => {
  console.log("login");
  const [ID, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [error, setError] = useState(""); // State for storing error message

  const loginHandler = async (event) => {
    event.preventDefault();

    try {
      // Sending a simple POST request with user ID and password
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID, password }), // Sending the ID and password in the request body
      });

      const responseData = await response.json();
      console.log("-------------------------------------------------------");
      console.log(responseData);
      console.log("-------------------------------------------------------");
      if (responseData.message === "OK") {
        onLogin(responseData.userId);
        onRoleChange(responseData.role);
        console.log("OGG");
        if(responseData.role === 'donator')
        {
            history.push("/InfoPage");
        }
        else
        {
          history.push("/");
        }
      } else if (response.status === 341) {
        setError("pending mode, ask your system manager update your role.");
      } else {
        setError("Wrong credentials"); // Set error message when credentials are wrong
      }
    } catch (err) {}
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message if there is one */}
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="card-title text-center mb-4">Login</h2>
        <form onSubmit={loginHandler}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={ID}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
