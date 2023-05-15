import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/letsEndorse/user/login",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Signup successful
        console.log("Login successful", response);
        alert(response.data.token);
      } else {
        // Handle other response statuses or errors
        console.log("Login failed");
      }
    } catch (error) {
      // Handle error
      alert(error.response.data.message);
      console.error("Error during Login:", error);
    }

    // Clear the form fields after successful signup
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
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

        <button type="submit" onClick={handleLogin}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
