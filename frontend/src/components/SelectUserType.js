import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectUserType = () => {
  const [userType, setUserType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get('email');
  const name = new URLSearchParams(location.search).get('name');
  const googleId = new URLSearchParams(location.search).get('googleId');

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting Data:", { email, name, googleId, userType });

  try {
    const response = await axios.post("http://localhost:5000/auth/save-user-type", {
      email,
      name,
      googleId,
      userType,
    });

    console.log("Response from server:", response.data);

    const token = response.data.token;
    localStorage.setItem("token", token);
    navigate("/");
  } catch (error) {
    console.error("Error saving user type:", error.response?.data || error);
    alert(error.response?.data?.message || "Error saving user type");
  }
};



  return (
    <div>
      <h1>Welcome, {name}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userType">Select User Type:</label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="">Select...</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SelectUserType;