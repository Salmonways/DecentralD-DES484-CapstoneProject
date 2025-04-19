import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        
        <div className="login-tabs">
          <button className="login-tab active">Login</button>
          <Link to="/register" className="login-tab">Register</Link>
        </div>

        <div className="login-box">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <Link to="/homepage" className="login-btn">Login</Link> 

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