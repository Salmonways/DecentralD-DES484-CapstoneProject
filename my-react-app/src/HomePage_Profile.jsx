import React from 'react';
import './HomePage_Profile.css';
import { useNavigate } from 'react-router-dom';
import IDImg from './assets/ID.png';

const HomePage_Profile = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/homepage'); // change '/home' to your actual route
  };

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item active" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>

      <h1 className="wallet-title">YOUR PROFILE</h1>

      <div className="wallet-id-card profile-mode">
        <img src={IDImg} alt="ID Card" />
      </div>

      <div className="profile-box">
        <div className="profile-form">
          <div className="form-row">
            <label>Full Name</label>
            <input type="text" placeholder="Test" />
          </div>

          <div className="form-row">
            <label>Username / Display Name</label>
            <input type="text" placeholder="test username" />
          </div>

          <div className="form-row">
            <label>Date of Birth</label>
            <input type="date" />
          </div>


          <div className="form-row">
            <label>Nationality</label>
            <input type="text" placeholder="Thai" />
          </div>

          <div className="form-row">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="form-row">
            <label>test@gmail.com</label>
            <input type="text" placeholder="Enter email or phone number" />
          </div>

          <button className="edit-button">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage_Profile;