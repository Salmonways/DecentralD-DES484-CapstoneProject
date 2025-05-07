import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMsg(""); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save JWT & DID in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('did', data.did);

        console.log('Logged in DID:', data.did);
        alert(`Login successful, welcome ${data.fullName || data.username}!`);
        navigate("/homepage");
      } else {
        setMsg(data.error || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="login-title">User Login</h1>

        <div className="login-tabs">
          <button className="login-tab active">Login</button>
          <Link to="/register" className="login-tab">Register</Link>
        </div>

        <div className="login-box">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
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
            <button type="submit" className="login-btn">Login</button>
            {msg && <div style={{ color: "crimson", marginTop: 8 }}>{msg}</div>}
          </form>

          <div className="login-forgot-password">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>
        </div>
      </div>

      <div className="back-button-wrapper">
        <Link to="/" className="bottom-left-back-btn">← Back</Link>
      </div>
    </div>
  );
};

export default LoginPage;