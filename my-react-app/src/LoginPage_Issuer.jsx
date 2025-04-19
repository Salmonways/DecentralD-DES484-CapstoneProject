import React, { useState } from 'react';
import './LoginPage_Issuer.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    adminEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Issuer Logged In:", formData);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        
        {/* Title */}
        <h1 className="issuer-login-title">Issuer Login</h1>

        <div className="login-tabs">
          <button className="login-tab active">Login</button>
          <Link to="/registerpageissuer" className="login-tab">Register</Link>
        </div>

        <div className="issuer-login-box">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="adminEmail"
              placeholder="Admin Email"
              value={formData.adminEmail}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Link type="submit" className="issuer-login-btn" to="/issuerdashboard">Login</Link>
          </form>

          <div className="login-forgot-password">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="back-button-wrapper">
        <Link to="/" className="bottom-left-back-btn">← Back</Link>
      </div>
    </div>
  );
};

export default LoginPage;