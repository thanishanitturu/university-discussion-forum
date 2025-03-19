import React, { useState } from "react";
import axios from "axios";
import styles from '../assets/signup.module.css'; // Import CSS Module correctly
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", userType: "student" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // const handleGoogleSignup = async () => {
  //   window.open("http://localhost:5000/auth/google", "_self");
  // };

  return (
    <div className={styles.signUpContainer}>
      <h1 className={styles.signUpHeading}>Signup</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup} className={styles.signUpForm}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className={styles.input} // Add class for input
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className={styles.input} // Add class for input
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className={styles.input} // Add class for input
        />
        <label className={styles.signUpLabel}>
          User Type:
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className={styles.input} // Add class for select
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
        </label>
        <button type="submit" className={styles.signUpButtonInsideForm}>
          Signup
        </button>
      </form>
      <h5 className={styles.text}>or</h5>
      {/* <button onClick={handleGoogleSignup} className={styles.signUpButton}>
        Signup with Google
      </button> */}
      <p className={styles.text}>
        Already had an account? <a href="/login" className={styles.link}>login</a>
      </p>
    </div>
  );
};

export default Signup;