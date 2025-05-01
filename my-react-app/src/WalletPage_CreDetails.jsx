import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WalletPage_CreDetails.css';

const WalletPage_CreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredential = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/credentials/detail/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch credential detail');
        }
        const data = await response.json();

        // Log to debug
        console.log('Fetched credential data:', data);

        // Update image path if available
        const updatedCredential = {
          ...data,
          filePath: data.filePath ? `http://localhost:5001${data.filePath}` : null,
        };

        setCredential(updatedCredential);
      } catch (err) {
        console.error(err);
        setError('Credential not found or failed to fetch.');
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [id]);

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>;
  if (error || !credential) return <p style={{ padding: '40px', color: 'red' }}>{error}</p>;

  const title = credential.credentialType
    ? credential.credentialType.toUpperCase()
    : 'UNTITLED CREDENTIAL';
  const issuerName = credential.issuerName || 'Unknown Issuer';

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
          {credential.filePath ? (
            <img
              src={credential.filePath}
              alt={`${issuerName} Logo`}
              className="walletpage-cred-logo"
            />
          ) : (
            <div className="walletpage-cred-logo-fallback">No Logo</div>
          )}
          <p className="walletpage-cred-status">
            Status: {credential.status === 'active' ? '✅ Verified' : '❌ Rejected'}
          </p>
        </div>

        <div className="walletpage-cred-info">
          <h2>{title}</h2>
          <p><strong>Issuer:</strong> {issuerName}</p>
          <p><strong>Type:</strong> {credential.credentialType}</p>
          <p><strong>Issue Date:</strong> {new Date(credential.created_at).toLocaleDateString()}</p>
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