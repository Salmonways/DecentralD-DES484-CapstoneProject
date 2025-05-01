import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalletPage.css';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('Verified');
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCredentials = async (status) => {
    setLoading(true);
    try {
      const did = localStorage.getItem('did');
      let url = '';
  
      if (status === 'Verified') {
        url = `http://localhost:5001/api/credentials/requests/${did}`;
      } else if (status === 'Rejected') {
        url = `http://localhost:5001/api/credentials/requestsnotfound/${did}`;
      }
  
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }
      const data = await response.json();
  
      const filtered = data.filter(cred => 
        status === 'Verified' ? cred.status === 'active' : cred.status === 'not found'
      );
      setCredentials(filtered);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials(activeTab === 'Verified' ? 'Verified' : 'Rejected');
  }, [activeTab]);

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            credentials.map((cred) => (
              <div className="walletPage-credential-card" key={cred.id}>
                <div className="walletPage-logo-wrapper">
                  <img src={cred.filePath} className="walletPage-logo" alt={cred.issuerName} />
                </div>
                <div className="walletPage-info">
                  <h3>{cred.issuerName}</h3>
                  <p>Status: {cred.status === 'active' ? '✅ Verified' : '❌ Rejected'}</p>
                  <button
                    className="walletPage-view-btn"
                    onClick={() => navigate(`/walletpage/credetails/${cred.id}`)}
                  >
                    VIEW DETAIL
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;