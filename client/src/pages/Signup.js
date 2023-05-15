import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function Signup({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    fullName: "",
    password: "",
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/letsEndorse/user/signup",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Signup successful
        console.log("Signup successful", response);
        alert(response.data.message);
        // Call the onSignupSuccess function passed from App component
        onSignupSuccess();
      } else {
        // Handle other response statuses or errors
        console.log("Signup failed", response.data.error);
        alert(response.data.error);
      }
    } catch (error) {
      // Handle error
      alert(error.response.data.message);
      console.error("Error during signup:", error);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Mobile Number:</label>
        <input
          type="number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={10}
        />

        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
      <p>
        Already a user? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
