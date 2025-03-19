import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser  } from "../context/UserContext"; // Import the UserContext
import styles from '../assets/signup.module.css';

const Login = () => {
  const { setUser  } = useUser (); // Get setUser  function from context
  const [formData, setFormData] = useState({ email: "", password: "", userType: "student" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      alert(res.data.message); // Ensure message exists


    const userData = {
      id: res.data.user._id,
      email: res.data.user.email,
      userType: res.data.user.userType, // Use userType from API response
      userName: res.data.user.name,
      token: res.data.token,
    };

    // ✅ Save user in context
    setUser(userData);

    // Store user data in context
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", res.data.token); // Store token separately

      // Redirect based on user type
      switch (formData.userType) {
        case "student":
          navigate("/studentDashboard");
          break;
        case "faculty":
          navigate("/facultyDashboard");
          break;
        case "admin":
          navigate("/adminDashboard");
          break;
        case "alumni":
          navigate("/alumniDashboard");
          break;
        case "clubCoordinator":
          navigate("/clubCoordinatorDashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show specific error message
      } else {
        alert("An unexpected error occurred."); // Fallback message
      }
    }
  };

  // const handleGoogleSignup = async () => {
  //   window.open("http://localhost:5000/auth/google", "_self");
  // };

  return (
    <div className={styles.signUpContainer}>
      <h1 className={styles.signUpHeading}>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.signUpForm}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className={styles.input} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className={styles.input} />
        
        <label className={styles.signUpLabel}>
          User Type:
          <select name="userType" value={formData.userType} onChange={handleChange} className={styles.input}>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="faculty">Faculty</option>
            <option value="clubCoordinator">Club Coordinator</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        
        <button type="submit" className={styles.signUpButtonInsideForm}>Login</button>
      </form>
      <h5>or</h5>
      {/* <button onClick={handleGoogleSignup} className={styles.signUpButton}>Login with Google</button> */}
      <p>Create Account <a href="/signup">signup</a></p>
    </div>
  );
};

export default Login;