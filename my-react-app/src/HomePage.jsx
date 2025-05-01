import React, { useEffect, useState } from 'react';
import './HomePage.css';

import IDImg from './assets/ID.png';
import { Link, useNavigate } from 'react-router-dom';



const HomePage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const userDID = localStorage.getItem('did');

  useEffect(() => {
    if (!userDID) {
      setCredentials([]); // Clear out old credentials if no user is logged in
      return;
    }
  
    const fetchCredentials = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/api/credentials/requests/${userDID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch credentials');
        const data = await res.json();
        const mappedCredentials = data.map((cred) => ({
          id: cred.id,
          title: cred.issuerName,
          status: cred.status,
          img: `http://localhost:5001${cred.filePath}`,
          subjectDID: cred.subjectDID,
        }));
        const filteredCredentials = mappedCredentials.filter((cred) => cred.subjectDID === userDID);
        setCredentials(filteredCredentials);
      } catch (err) {
        console.error('Error loading credentials:', err);
        setCredentials([]); // Fallback: clear on error
      }
    };
  
    setCredentials([]); // Always clear previous credentials before fetching new ones
    fetchCredentials();
  }, [userDID]);

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
          <div className="credential-card" key={cred.id || index}>
            <img src={cred.img} alt={cred.title} />
            <p className="cred-title">{cred.title}</p>
            <p className="cred-status">Status: {cred.status}</p>
          </div>
        ))}

        {/* Always show the "Add Credential" card at the end */}
        <Link to="/homepage_addcre" className="credential-card add-card">
          <div className="add-circle">＋</div>
          <p>ADD Credential</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
