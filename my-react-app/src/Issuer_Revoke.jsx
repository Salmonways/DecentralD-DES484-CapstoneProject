import React, { useEffect, useState } from 'react';
import './Issuer_Revoke.css';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tuImg from './assets/TU.png';

const mockIssuedCredentials = [
  {
    id: 'cred:0x7a41fcde12',
    title: 'BACHELOR DEGREE - TU',
    issuerName: 'Thammasat University',
    issuerDID: 'did:university:tu001',
    subjectName: 'Jane Doe',
    subjectDID: 'did:student:abc123',
    type: 'Bachelor’s Degree',
    description: 'Bachelor of Engineering (Computer Science), GPA 3.65',
    status: 'Verified',
    issueDate: '2023-10-15',
    expirationDate: '2027-10-15',
    tags: ['engineering', 'bachelor', 'tu'],
    schemaUrl: 'https://schemas.org/tu-bachelor-cs',
    cryptoProof: 'proof:0x9f1a...3cd7',
    fileUrl: null,
    logo: tuImg
  },
  {
    id: 'cred:0x8a22bbf43a',
    title: 'MASTER DEGREE - TU',
    issuerName: 'Thammasat University',
    issuerDID: 'did:university:tu001',
    subjectName: 'John Smith',
    subjectDID: 'did:student:def456',
    type: 'Master’s Degree',
    description: 'Master of Business Administration, GPA 3.90',
    status: 'Verified',
    issueDate: '2022-09-10',
    expirationDate: '2026-09-10',
    tags: ['mba', 'business', 'tu'],
    schemaUrl: 'https://schemas.org/tu-mba',
    cryptoProof: 'proof:0x5e2b...aa8f',
    fileUrl: null,
    logo: tuImg
  }
];

const Issuer_Revoke = () => {
  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetch
    setCredentials(mockIssuedCredentials);
  }, []);

  const handleRevoke = (id) => {
    const confirm = window.confirm('Are you sure you want to revoke this credential?');
    if (confirm) {
      setCredentials(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'Revoked' } : c)
      );
      alert('Credential revoked successfully!');
    }
  };

  const filtered = credentials.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subjectDID.toLowerCase().includes(search.toLowerCase()) ||
    c.subjectName.toLowerCase().includes(search.toLowerCase())
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
              <img src={cred.logo} alt="logo" className="issuer-logo" />
              <div className="credential-info">
                <h2>{cred.title}</h2>
                <p><strong>Credential ID:</strong> {cred.id}</p>
                <p><strong>Issuer:</strong> {cred.issuerName} ({cred.issuerDID})</p>
                <p><strong>Subject:</strong> {cred.subjectName} ({cred.subjectDID})</p>
                <p><strong>Type:</strong> {cred.type}</p>
                <p><strong>Description:</strong> {cred.description}</p>
                <p><strong>Tags:</strong> {cred.tags ? cred.tags.join(', ') : 'N/A'}</p>
                <p><strong>Issue Date:</strong> {cred.issueDate}</p>
                <p><strong>Expiration Date:</strong> {cred.expirationDate}</p>
                <p><strong>Schema URL:</strong> <a href={cred.schemaUrl} target="_blank" rel="noreferrer">{cred.schemaUrl}</a></p>
                <p><strong>Crypto Proof:</strong> {cred.cryptoProof}</p>
                <p><strong>Status:</strong> {cred.status === 'Verified' ? '✅ Verified' : '❌ Revoked'}</p>
                <button
                  className="revoke-button"
                  onClick={() => handleRevoke(cred.id)}
                  disabled={cred.status === 'Revoked'}
                >
                  {cred.status === 'Revoked' ? 'REVOKED' : 'REVOKE'}
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