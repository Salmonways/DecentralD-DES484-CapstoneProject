import React from 'react';
import './ForgotPasswordPage.css';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
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
          <input type="email" placeholder="Enter your email" />
          <button className="forgot-btn">Send Reset Link</button>
          <div className="back-login">
            <Link to="/">Back to Landing Page</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;