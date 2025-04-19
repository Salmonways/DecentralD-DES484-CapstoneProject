import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import landingImage from './assets/landing.jpg'; 


const LandingPage = () => {
  return (
    <div className="landing-page"
>
        
      <div className="landing-content">
        <h1 className="title">DecentralID</h1>
        <p className="subtitle">
          a secure, decentralized identity wallet that lets you manage, store, and share <br />
          your verifiable credentials—anytime, anywhere, without relying on central authorities.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="landing-btn">LOGIN AS USER</Link>
          <Link to="/issuerlogin" className="landing-btn">LOGIN AS ISSUER</Link>
          <Link to="/verificationhome" className="landing-btn">VERIFY CREDENTIAL</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;