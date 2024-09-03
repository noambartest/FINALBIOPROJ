import React from "react";
import { useState } from "react";
import "./Register.css"; // Import the CSS file
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    ID: "",
    password: "",
    birthDate: {
      day: "1",
      month: "1",
      year: "2024",
    },
  });
  const [message, setMessage] = useState(null); // For displaying messages

  const handleSubmit = async (event) => {
    console.log(formData);
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      if (response.status === 200) {
        setMessage("Registration successful!");
      }
      else{
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("birthDate")) {
      const [, key] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        birthDate: {
          ...prevState.birthDate,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    let years = [];
    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="register-container">
      <h2 className="register-header">Register Page</h2>
      <form className="register-form"   onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            name="ID"
            value={formData.ID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Birth Date:</label>
          <div className="birthdate-group">
            <div className="birthdate-select">
              <label htmlFor="day">Day:</label>
              <select
                id="daySelect"
                value={formData.birthDate.day}
                onChange={handleChange}
                name="birthDate.day"
              >
                {[...Array(31).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="birthdate-select">
              <label htmlFor="month">Month:</label>
              <select
                id="monthSelect"
                value={formData.birthDate.month}
                onChange={handleChange}
                name="birthDate.month"
              >
                {[...Array(12).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="birthdate-select">
              <label htmlFor="year">Year:</label>
              <select
                id="yearSelect"
                value={formData.birthDate.year}
                onChange={handleChange}
                name="birthDate.year"
              >
                {generateYears().map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="register-button"
        
        >
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
