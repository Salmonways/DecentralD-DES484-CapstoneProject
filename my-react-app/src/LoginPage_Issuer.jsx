import React, { useState } from 'react';
import './LoginPage_Issuer.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/api/issuer/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            adminEmail: formData.adminEmail,
            password: formData.password
        })
    });
    const data = await response.json();
    if (response.ok) {
        alert("Issuer login successful!");
        navigate("/issuerdashboard"); // Redirect after successful login
    } else {
        alert(data.error || "Login failed");
    }

    if (response.ok) {
      localStorage.setItem('adminEmail', formData.adminEmail); // <-- Save it here
      alert("Issuer login successful!");
      navigate("/issuerdashboard");
    }
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
            <button type="submit" className="issuer-login-btn">Login</button>
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
