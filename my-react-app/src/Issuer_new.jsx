import React, { useState , useEffect} from 'react';
import './Issuer_new.css';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Issuer_new = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [subjectDID, setSubjectDID] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [cryptoProof] = useState('SignedJWT-abc123xyz'); // Mock proof
  const [issuerName, setIssuerName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [adminEmail] = useState(localStorage.getItem('adminEmail')); // or use JWT if you prefer
  const [issuerDID, setIssuerDID] = useState('');
  const [credentialId, setCredentialId] = useState(() => `cred-${Date.now()}`);

  useEffect(() => {
    const fetchIssuerInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/issuer/profile?email=${adminEmail}`);
        const data = await res.json();
        setIssuerName(data.issuerName);
        // Uncomment the next line if you want to override the default issuerDID
        setIssuerDID(data.issuerDID);
      } catch (err) {
        console.error('Error fetching issuer info:', err);
      }
    };
  
    if (adminEmail) fetchIssuerInfo();
  }, [adminEmail]);
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('subjectDID', subjectDID);
    formData.append('issuerDID', issuerDID);
    formData.append('issueDate', issueDate);
    formData.append('expiryDate', expiryDate);
    formData.append('cryptoProof', cryptoProof);
    formData.append('subjectName', subjectName);
    formData.append('description', description);
    formData.append('metadata', metadata);
    formData.append('credentialId', credentialId);
    formData.append('issuerName', issuerName); // Ensure this is included
    formData.append('tags', tags);
    if (file) formData.append('file', file); // Optional
  
    try {
      const res = await fetch('http://localhost:5001/api/credentials/issue', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Issue error:', err);
      alert('Failed to issue credential.');
    }
  };
  console.log("adminEmail from localStorage:", adminEmail);

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
          


          <label>Credential ID</label>
          <input
            type="text"
            value={credentialId}
            readOnly
          />
          <label>Credential Type (e.g., DegreeCertificate)</label>
            <select name="Credential Type" value={type}  onChange={(e) => setType(e.target.value)}>
              <option value="">Select Credential Type</option>
              <option value="Degree">Degree</option>
              <option value="Certificate">Certificate</option>
              <option value="ID Card">ID Card</option>
            </select>

          <label>Subject DID</label>
          <input type="text" placeholder="Subject DID" value={subjectDID} onChange={(e) => setSubjectDID(e.target.value)} />

          <label>Issuer DID</label>
          <input type="text" placeholder="Issuer DID" value={issuerDID || 'Loading...'} readOnly />

          <label>Issue Date</label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="date-select" />

          <label>Expiration Date</label>
          <input type="date" value={expiryDate} onChange={(e) => setexpiryDate(e.target.value)} className="date-select" />

          <label>Issuer Name / Organization</label>
          <input type="text" placeholder="Issuer Name / Organization" value={issuerName} onChange={(e) => setIssuerName(e.target.value)} readOnly />

          <label>Subject Name</label>
          <input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />

          <label>Description</label>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

          <label>Credential Metadata (e.g., GPA, Grade, etc.)</label>
          <textarea placeholder="Credential Metadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} rows={3} />

          <label>Tags / Categories</label>
          <input type="text" placeholder="Tags / Categories" value={tags} onChange={(e) => setTags(e.target.value)} />



          <label>Upload File</label>
          <label className="file-upload">
            <span>Upload File</span>
            <Upload size={18} />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </label>

          <p className="issue-warning">Please complete all required fields</p>

          <button type="submit" className="issue-button">ISSUE CREDENTIAL</button>
        </form> 
      </div>
    </div>
  );

};


export default Issuer_new;