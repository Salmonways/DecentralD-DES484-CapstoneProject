import React, { useEffect, useState } from 'react';
import './Issuer_Revoke.css';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tuImg from './assets/TU.png';

const Issuer_Revoke = () => {
  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const adminEmail = localStorage.getItem('adminEmail');

  useEffect(() => {
    const fetchCredentials = async () => {
      const adminEmail = localStorage.getItem('adminEmail');
      console.log('📥 Fetching credentials for adminEmail:', adminEmail);
  
      if (!adminEmail) {
        alert('User is not logged in!');
        navigate('/login');
        return;
      }
  
      try {
        const response = await fetch(`/api/credentials/requestss/${adminEmail}`);
        console.log('✅ Raw fetch response:', response);
      
        const contentType = response.headers.get('content-type');
        const rawText = await response.text();
        console.log('📄 Raw response body:', rawText);
      
        if (!response.ok) {
          console.error('❌ Server returned error response:', rawText);
          return;
        }
      
        if (contentType && contentType.includes('application/json')) {
          const data = JSON.parse(rawText);
          console.log('✅ Parsed credentials data:', data);
          setCredentials(data);
        } else {
          throw new SyntaxError('Expected JSON but got something else.');
        }
      } catch (error) {
        console.error('🚨 Error fetching credentials:', error);
      }
    };
  
    fetchCredentials();
  }, [adminEmail, navigate]);

  const handleRevoke = async (id) => {
    const confirm = window.confirm('Are you sure you want to revoke this credential?');
    if (confirm) {
      try {
        const response = await fetch(`/api/credentials/${id}/revoke`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminEmail }),
        });
        if (response.ok) {
          setCredentials(prev =>
            prev.map(c => c.id === id ? { ...c, status: 'revoked' } : c)
          );
          alert('Credential revoked successfully!');
        } else {
          alert('Failed to revoke credential');
        }
      } catch (error) {
        console.error('Error revoking credential:', error);
      }
    }
  };
  const filtered = credentials.filter(c =>
    c.id.toString().includes(search.toLowerCase()) ||         // Search by Credential ID
    c.issuerName.toLowerCase().includes(search.toLowerCase()) || // Search by Issuer name
    c.issuerDID.toLowerCase().includes(search.toLowerCase()) || // Search by Issuer DID
    c.subjectName.toLowerCase().includes(search.toLowerCase()) || // Search by Subject name
    c.subjectDID.toLowerCase().includes(search.toLowerCase()) ||  // Search by Subject DID
    c.credentialType.toLowerCase().includes(search.toLowerCase()) || // Search by Type
    c.description.toLowerCase().includes(search.toLowerCase()) ||   // Search by Description
    (Array.isArray(c.tags) && c.tags.join(' ').toLowerCase().includes(search.toLowerCase())) || // Search by Tags (if tags are an array)
    c.issueDate.toLowerCase().includes(search.toLowerCase()) ||   // Search by Issue Date
    c.expirationDate.toLowerCase().includes(search.toLowerCase()) || // Search by Expiration Date
    c.cryptoProof.toLowerCase().includes(search.toLowerCase()) || // Search by Crypto Proof
    c.status.toLowerCase().includes(search.toLowerCase()) // Search by Status
  );

  return (
    <div className="revoke-container">
      <nav className="issuer-nav">
        <span onClick={() => navigate('/issuerdashboard')}>HOME</span>
        <span onClick={() => navigate('/issuernew')}>ISSUE CREDENTIAL</span>
        <span className="active" onClick={() => navigate('/issuerrevoke')}>REVOKE CREDENTIAL</span>
      </nav>

      <h1 className="revoke-title">REVOKE CREDENTIAL</h1>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search credential..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="credentials-list">
        {filtered.length > 0 ? (
          filtered.map((cred) => (
            <div className="credential-card-issuer" key={cred.id}>
              <img src={cred.logo || tuImg} alt="logo" className="issuer-logo" />
              <div className="credential-info">
                <h2>{cred.title}</h2>
                <p><strong>Credential ID:</strong> {cred.id}</p>
                <p><strong>Issuer:</strong> {cred.issuerName} ({cred.issuerDID})</p>
                <p><strong>Subject:</strong> {cred.subjectName} ({cred.subjectDID})</p>
                <p><strong>Type:</strong> {cred.credentialType}</p>
                <p><strong>Description:</strong> {cred.description}</p>
                <p><strong>Tags:</strong> {Array.isArray(cred.tags) ? cred.tags.join(', ') : 'N/A'}</p>
                <p><strong>Issue Date:</strong> {cred.issueDate}</p>
                <p><strong>Expiration Date:</strong> {cred.expirationDate}</p>
                <p><strong>Crypto Proof:</strong> {cred.cryptoProof}</p>
                <p><strong>Status:</strong> {cred.status}</p>
                <button
                  className="revoke-button"
                  onClick={() => handleRevoke(cred.id)}
                  disabled={cred.status === 'revoked'}
                >
                  {cred.status === 'revoked' ? 'REVOKED' : 'REVOKE'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No credentials found.</p>
        )}
      </div>
    </div>
  );
};

export default Issuer_Revoke;