import React from 'react';
import './HomePage.css';
import tuImg from './assets/TU.png';
import ibmImg from './assets/IBM.png';
import toeicImg from './assets/TOEIC.png';
import IDImg from './assets/ID.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const credentials = [

  {
    title: "Bachelor Degree - TU",
    status: "✅ Verified",
    img: tuImg,
  },
  {
    title: "IBM Certificate",
    status: "✅ Verified",
    img: ibmImg,
  },
  {
    title: "TOEIC Result - ETS",
    status: "✅ Verified",
    img: toeicImg,
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item active" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>

      <h1 className="wallet-title">YOUR DIGITAL WALLET</h1>



      <div className="wallet-id-card">
        <Link to="/homepage_profile">
          <img src={IDImg} alt="ID Card" />
        </Link>
      </div>

      <div className="credential-header">
        <h2>Credential Cards</h2>
        <span className="arrow">➝</span>
      </div>

      <div className="credential-cards">
        {credentials.map((cred, index) => (
          <div className="credential-card" key={index}>
            <img src={cred.img} alt={cred.title} />
            <p className="cred-title">{cred.title}</p>
            <p className="cred-status">Status: {cred.status}</p>
          </div>
        ))}
        <Link to="/homepage_addcre" className="credential-card add-card">
          <div className="add-circle">＋</div>
          <p>ADD Credential</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;