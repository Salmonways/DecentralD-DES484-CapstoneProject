import React, { useState } from 'react';
import './Issuer_new.css';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Issuer_new = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [subjectDID, setSubjectDID] = useState('');
  const [issuerDID] = useState('did:issuer:123456'); // Mock logged-in issuer DID
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [credentialId] = useState('cred-' + Math.random().toString(36).substr(2, 9)); // Mock UUID
  const [status, setStatus] = useState('Active');
  const [cryptoProof] = useState('SignedJWT-abc123xyz'); // Mock proof
  const [issuerName, setIssuerName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState('');
  const [tags, setTags] = useState('');
  const [schemaUrl, setSchemaUrl] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title, type, subjectDID, issuerDID, issueDate, expirationDate,
      credentialId, status, cryptoProof, issuerName, subjectName,
      description, metadata, tags, schemaUrl, file
    });
    // Logic to submit form data goes here
    window.alert('Credential issued successfully!');

  };

  return (
    <div className="issue-container">
      <nav className="issuer-nav">
        <span onClick={() => navigate('/issuerdashboard')}>HOME</span>
        <span className="active" onClick={() => navigate('/issuernew')}>ISSUE CREDENTIAL</span>
        <span onClick={() => navigate('/issuerrevoke')}>REVOKE CREDENTIAL</span>
      </nav>

      <h1 className="issue-title">ISSUE NEW CREDENTIAL</h1>

      <div className="issuer-box-new">
        <form className="issue-form" onSubmit={handleSubmit}>
          <label>Credential Title</label>
          <input type="text" placeholder="Credential Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          
          <label>Credential Type (e.g., DegreeCertificate)</label>
          <input type="text" placeholder="Credential Type" value={type} onChange={(e) => setType(e.target.value)} />

          <label>Subject DID</label>
          <input type="text" placeholder="Subject DID" value={subjectDID} onChange={(e) => setSubjectDID(e.target.value)} />

          <label>Issuer DID</label>
          <input type="text" placeholder="Issuer DID" value={issuerDID} readOnly />

          <label>Issue Date</label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="date-select" />

          <label>Expiration Date</label>
          <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="date-select" />

          <label>Credential ID</label>
          <input type="text" placeholder="Credential ID" value={credentialId} readOnly />

          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Revoked">Revoked</option>
            <option value="Expired">Expired</option>
          </select>

          <label>Cryptographic Proof</label>
          <input type="text" placeholder="Cryptographic Proof" value={cryptoProof} readOnly />

          <label>Issuer Name / Organization</label>
          <input type="text" placeholder="Issuer Name / Organization" value={issuerName} onChange={(e) => setIssuerName(e.target.value)} />

          <label>Subject Name</label>
          <input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />

          <label>Description</label>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

          <label>Credential Metadata (e.g., GPA, Grade, etc.)</label>
          <textarea placeholder="Credential Metadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} rows={3} />

          <label>Tags / Categories</label>
          <input type="text" placeholder="Tags / Categories" value={tags} onChange={(e) => setTags(e.target.value)} />

          <label>Credential Schema URL</label>
          <input type="url" placeholder="Credential Schema URL" value={schemaUrl} onChange={(e) => setSchemaUrl(e.target.value)} />

          <label>Upload File</label>
          <label className="file-upload">
            <span>Upload file</span>
            <Upload size={18} />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} hidden />
          </label>

          <p className="issue-warning">Please complete all required fields</p>

          <button type="submit" className="issue-button">ISSUE CREDENTIAL</button>
        </form> 
      </div>
    </div>
  );
};

export default Issuer_new;