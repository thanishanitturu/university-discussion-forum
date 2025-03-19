import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/send-otp", { email });
      alert("OTP sent to email!");
      setStep(2);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/verify-otp", { email, otp, name, password });
      alert("Signup successful! Please log in.");
      setStep(1);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      {step === 1 ? (
        <div>
          <h2>Sign Up</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={verifyOtp}>Verify & Signup</button>
        </div>
      )}
    </div>
  );
};

export default Signup;
