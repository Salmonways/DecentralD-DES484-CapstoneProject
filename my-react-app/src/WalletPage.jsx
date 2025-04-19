import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalletPage.css';
import tuImg from './assets/TU.png';
import toeicImg from './assets/TOEIC.png';
import IDImg from './assets/ID.png';

const credentials = [
  {
    id: 1,
    title: 'Bachelor Degree - TU',
    issuer: 'Thammasat University',
    status: 'Verified',
    logo: tuImg,
  },
  {
    id: 2,
    title: 'TOEIC Result - ETS',
    issuer: 'ETS',
    status: 'Verified',
    logo: toeicImg,
  },
  {
    id: 3,
    title: 'National ID - Thai Gov',
    issuer: 'Thai Government',
    status: 'Rejected',
    logo: IDImg,
  },
];

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('Verified');
  const navigate = useNavigate();

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item " onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item active" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>

      <div className="walletPage-container">
        <h1 className="walletPage-title">MY WALLET</h1>

        <div className="walletPage-tabs">
          <button
            className={activeTab === 'Verified' ? 'walletPage-tab walletPage-active' : 'walletPage-tab'}
            onClick={() => setActiveTab('Verified')}
          >
            ✅ VERIFIED
          </button>
          <button
            className={activeTab === 'Rejected' ? 'walletPage-tab walletPage-active' : 'walletPage-tab'}
            onClick={() => setActiveTab('Rejected')}
          >
            ❌ REJECTED
          </button>
        </div>

        <h2 className="walletPage-subtitle">CREDENTIAL CARDS →</h2>

        <div className="walletPage-credential-list">
          {credentials
            .filter((cred) => cred.status === activeTab)
            .map((cred) => (
              <div className="walletPage-credential-card" key={cred.id}>
                <div className="walletPage-logo-wrapper">
                  <img src={cred.logo} alt={cred.issuer} className="walletPage-logo" />
                </div>
                <div className="walletPage-info">
                  <h3>{cred.title}</h3>
                  <p>Status: {cred.status === 'Verified' ? '✅ Verified' : '❌ Rejected'}</p>
                  <button
                    className="walletPage-view-btn"
                    onClick={() => navigate(`/walletpage/credetails/${cred.id}`)}
                    >
                    VIEW DETAIL
                </button>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;