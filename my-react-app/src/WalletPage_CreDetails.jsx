import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WalletPage_CreDetails.css';
import tuImg from './assets/TU.png';
import toeicImg from './assets/TOEIC.png';
import IDImg from './assets/ID.png';

const credentialData = {
  1: {
    logo: tuImg,
    title: 'Bachelor Degree - TU',
    issuer: 'Thammasat University',
    type: 'Bachelor’s Degree',
    issueDate: '15 October 2023',
    credentialID: 'cred:0x7a41fcde12...',
    description: 'Bachelor of Engineering (Computer Science), GPA 3.65',
    status: 'Verified',
  },
  2: {
    logo: toeicImg,
    title: 'TOEIC Result - ETS',
    issuer: 'ETS',
    type: 'English Proficiency Test',
    issueDate: '01 February 2023',
    credentialID: 'cred:0x8b29deaa99...',
    description: 'TOEIC Score: 945 / 990 - Listening & Reading.',
    status: 'Verified',
  },
  3: {
    logo: IDImg,
    title: 'National ID - Thai Gov',
    issuer: 'Thai Government',
    type: 'National Identity Document',
    issueDate: '10 January 2020',
    credentialID: 'cred:0x3c42daaa45...',
    description: 'Thai Government-issued national ID. Invalid due to formatting error.',
    status: 'Rejected',
  },
};

const WalletPage_CreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const credential = credentialData[id];

  if (!credential) {
    return <p style={{ padding: '40px', color: 'red' }}>Credential not found.</p>;
  }

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item active" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>
      <h1 className="walletpage-cred-title">CREDENTIAL DETAILS</h1>
  
      <div className="walletpage-cred-content">
        <div className="walletpage-cred-left">
          <img
            src={credential.logo}
            alt={`${credential.issuer} Logo`}
            className="walletpage-cred-logo"
          />
          <p className="walletpage-cred-name">{credential.title}</p>
          <p className="walletpage-cred-status">
            Status: {credential.status === 'Verified' ? '✅ Verified' : '❌ Rejected'}
          </p>
        </div>
  
        <div className="walletpage-cred-info">
          <h2>{credential.title.toUpperCase()}</h2>
          <p><strong>Issuer:</strong> {credential.issuer}</p>
          <p><strong>Type:</strong> {credential.type}</p>
          <p><strong>Issue Date:</strong> {credential.issueDate}</p>
          <p><strong>Credential ID:</strong> {credential.credentialID}</p>
          <p><strong>Description:</strong> {credential.description}</p>
        </div>
      </div>
  
      <button className="walletpage-share-btn" onClick={() => navigate('/sharepage')}>
        SHARE CREDENTIAL
        </button>
      <button className="walletpage-back-btn" onClick={() => navigate(-1)}>← BACK</button>
    </div>
  );
};

export default WalletPage_CreDetails;