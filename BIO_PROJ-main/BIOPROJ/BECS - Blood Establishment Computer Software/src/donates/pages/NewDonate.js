import React, { useState } from "react";
import Dropdown from "../../shared/FormElements/dropd/dropd";
import Button from "../../shared/FormElements/Button";
import NotAllowedMessage from "../components/NotAllowedMessage";
import DateDropDownSelection from "../../shared/dateSelection";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./NewDonate.css";




const NewDonate = (props) => {
  const history = useHistory();

  const initForm = {
    fullName: "",
    btype: "",
    address: "",
    donatorID: "",
    birthDate: {
      day: "1",
      month: "1",
      year: "2024",
    },
    donateDate: {
      day: "1",
      month: "1",
      year: "2024",
    },
    mentalHealthCondition: "",
    careProvided: "",
    creditCard: "",
    health_fund: "",
  };

  const [formData, setFormData] = useState(initForm);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName) newErrors.fullName = "Full Name is required";

    // Blood Type
    if (!formData.btype) newErrors.btype = "Blood Type is required";

    // Address
    if (!formData.address) newErrors.address = "Address is required";

    // Donator ID (must be exactly 9 digits)
    const donatorIDRegex = /^\d{9}$/;
    if (!formData.donatorID || !donatorIDRegex.test(formData.donatorID)) {
      newErrors.donatorID = "Donator ID must be exactly 9 digits";
    }

    // Mental Health Condition
    if (!formData.mentalHealthCondition)
      newErrors.mentalHealthCondition = "Mental Health Condition is required";

    // Care Provided
    if (!formData.careProvided)
      newErrors.careProvided = "Care Provided is required";

    // Credit Card (must be exactly 16 digits)
    const creditCardRegex = /^\d{16}$/;
    if (!formData.creditCard || !creditCardRegex.test(formData.creditCard)) {
      newErrors.creditCard = "Credit Card Number must be exactly 16 digits";
    }

    // Validate date fields
    if (
      !formData.birthDate.day ||
      !formData.birthDate.month ||
      !formData.birthDate.year
    ) {
      newErrors.birthDate = "Complete Birth Date is required";
    }
    if (
      !formData.donateDate.day ||
      !formData.donateDate.month ||
      !formData.donateDate.year
    ) {
      newErrors.donateDate = "Complete Donation Date is required";
    }

    setErrors(newErrors);

    // If there are no errors, return true; otherwise, return false
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((state) => ({ ...state, [name]: value }));
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const [dateObjName, dateField] = name.split(".");

    setFormData((prevState) => ({
      ...prevState,
      [dateObjName]: {
        ...prevState[dateObjName],
        [dateField]: value,
      },
    }));
  };

  const donateSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const response = await fetch("http://localhost:5000/api/donates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          btype: formData.btype,
          address: formData.address,
          donatorID: formData.donatorID,
          birthDate: {
            day: formData.birthDate.day,
            month: formData.birthDate.month,
            year: formData.birthDate.year,
          },
          donateDate: {
            day: formData.donateDate.day,
            month: formData.donateDate.month,
            year: formData.donateDate.year,
          },
          mentalHealthCondition: formData.mentalHealthCondition,
          careProvided: formData.careProvided,
          creditCard: formData.creditCard,
          health_fund: formData.health_fund,
        }),
      });
      if (response.ok) {
        history.push('/');      }
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (props.role === "admin" || props.role === "user") {
    return (
      <form className="donate-form" onSubmit={donateSubmitHandler}>
        <Dropdown
          id="b_type"
          label="Blood Type"
          options={bloodTypes}
          value={formData.bType}
          onSelect={(value) =>
            setFormData((state) => ({ ...state, btype: value }))
          }
        />
        {errors.btype && <p className="error-text">{errors.btype}</p>}
        <DateDropDownSelection
          label="Donation Date"
          formData={formData}
          dateObjName="donateDate"
          handleDateChange={handleDateChange}
        />
        {errors.donateDate && <p className="error-text">{errors.donateDate}</p>}
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && <p className="error-text">{errors.address}</p>}
        <label htmlFor="address">Donator ID:</label>
        <input
          type="text"
          id="donatorID"
          name="donatorID"
          value={formData.donatorID}
          onChange={handleChange}
          required
        />
        {errors.donatorID && <p className="error-text">{errors.donatorID}</p>}
        <div className="form-group">
          <DateDropDownSelection
            label="Birth Date"
            formData={formData}
            dateObjName="birthDate"
            handleDateChange={handleDateChange}
          />
          {errors.birthDate && <p className="error-text">{errors.birthDate}</p>}
        </div>
        <label htmlFor="mentalHealthCondition">Mental Health Condition:</label>
        <textarea
          id="mentalHealthCondition"
          name="mentalHealthCondition"
          value={formData.mentalHealthCondition}
          onChange={handleChange}
          required
          rows="5"
          cols="50"
        />
        {errors.mentalHealthCondition && (
          <p className="error-text">{errors.mentalHealthCondition}</p>
        )}
        <label htmlFor="careProvided">Care Provider ID:</label>
        <input
          type="text"
          id="careProvided"
          name="careProvided"
          value={formData.careProvided}
          onChange={handleChange}
          required
        />
        {errors.careProvided && (
          <p className="error-text">{errors.careProvided}</p>
        )}
        <label htmlFor="creditCard">Credit Card Number:</label>
        <input
          type="text"
          id="creditCard"
          name="creditCard"
          value={formData.creditCard}
          onChange={handleChange}
          required
        />
        {errors.creditCard && <p className="error-text">{errors.creditCard}</p>}
        <Button type="submit">Add Donation</Button>
      </form>
    );
  } else {
    return <NotAllowedMessage />;
  }
};

export default NewDonate;
