import React, { useState } from 'react';
import './RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    did: generateDID()
  });

  function generateDID() {
    return `did:example:${Math.random().toString(36).substr(2, 10)}`;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDIDRegenerate = () => {
    setFormData({ ...formData, did: generateDID() });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/did", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          did: formData.did,
          userData: {
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
          },
          password: formData.password
        })
      });

      if (response.ok) {
        alert("Registered successfully! Your DID is: " + formData.did);
        navigate("/login");
      } else {
        let errorMsg = "Unknown error";
        try {
          const error = await response.json();
          errorMsg = error.error || JSON.stringify(error);
        } catch (e) {
          errorMsg = "Server did not return JSON";
        }
        alert("Registration failed: " + errorMsg);
        return;
      }
    } catch (err) {
      alert("Registration error: " + err.message);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        <div className="register-tabs">
          <Link to="/login" className="register-tab">Login</Link>
          <button className="register-tab active">Register</button>
        </div>

        <div className="register-box">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} />

          <div className="did-field-wrapper">
            <input type="text" name="did" value={formData.did} readOnly />
            <button type="button" className="regenerate-btn" onClick={handleDIDRegenerate}>Regenerate DID</button>
          </div>

          <button className="register-btn" onClick={handleRegister}>Register</button>

          <div className="register-forgot-password">
            <Link to="/forgotpassword" >Forgot Password?</Link>
          </div>
          <div className="back-button-wrapper">
            <Link to="/" className="bottom-left-back-btn">← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
