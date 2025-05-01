import React, { useState } from 'react';
import './ForgotPasswordPage.css';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleReset = async () => {
    setMessage(null);
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const error = await response.json();
        setMessage("Reset failed: " + error.error);
      }
    } catch (err) {
      setMessage("Reset error: " + err.message);
    }
  };

  return (
    <div className="forgot-page-wrapper">
      <div className="forgot-container">
        <div className="forgot-tabs">
          <Link to="/" className="forgot-tab">Login</Link>
          <Link to="/register" className="forgot-tab">Register</Link>
          <button className="forgot-tab active">Forgot Password</button>
        </div>

        <div className="forgot-box">
          <h2>Reset Your Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="forgot-btn" onClick={handleReset}>Send Reset Link</button>
          {message && <div style={{ color: message.startsWith("Reset failed") ? 'crimson' : 'green', marginTop: 10 }}>{message}</div>}
          <div className="back-login">
            <Link to="/">Back to Landing Page</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
