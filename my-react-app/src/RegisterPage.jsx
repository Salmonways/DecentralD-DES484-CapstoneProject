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

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registered successfully! Your DID is: " + formData.did);
    navigate("/login");
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