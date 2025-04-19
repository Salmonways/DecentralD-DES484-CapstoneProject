import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage_AddCre.css';

const HomePage_AddCre = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issuerName: '',
    credentialType: '',
    subjectDID: '',
    requestedDate: '',
    expiryDate: '',
    reason: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { issuerName, credentialType, subjectDID, requestedDate, reason, file } = formData;
    if (!issuerName || !credentialType || !subjectDID || !requestedDate || !reason || !file) {
      alert('Please complete all required fields');
      return;
    }
    console.log('Submitting:', formData);
    // Handle submission logic here
  };

  return (
    <div className="add-cred-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item active" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>

      <div className="add-cred-container">
        <h1 className="wallet-title">REQUEST FOR CREDENTIAL</h1>
        <form onSubmit={handleSubmit} className="add-cred-form">
          <select name="credentialType" value={formData.credentialType} onChange={handleChange}>
            <option value="">Select Credential Type</option>
            <option value="Degree">Degree</option>
            <option value="Certificate">Certificate</option>
            <option value="ID Card">ID Card</option>
          </select>

          <input
            type="text"
            name="issuerName"
            placeholder="Issuer Name"
            value={formData.issuerName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subjectDID"
            placeholder="Subject DID"
            value={formData.subjectDID}
            onChange={handleChange}
          />

          <input
            type="date"
            name="requestedDate"
            value={formData.requestedDate}
            onChange={handleChange}
          />

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />

          <textarea
            name="reason"
            placeholder="Reason for Request"
            value={formData.reason}
            onChange={handleChange}
          />

          <label className="upload-label">
            Upload Supporting Document
            <input
              type="file"
              name="file"
              onChange={handleChange}
            />
          </label>

          <p className="form-note">Please complete all required fields</p>
          <button type="submit" className="submit-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage_AddCre;