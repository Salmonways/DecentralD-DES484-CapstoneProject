import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage_AddCre.css';
import { Upload } from 'lucide-react';

const HomePage_AddCre = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issuerName: '',
    issuerDID: '',
    credentialType: '',
    credentialID: '',
    issueDate: '',
    expiryDate: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to submit a credential request.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('issuerDID', formData.issuerDID);
    formDataToSend.append('credentialID', formData.credentialID);
    formDataToSend.append('credentialType', formData.credentialType);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('issueDate', formData.issueDate);
    formDataToSend.append('expiryDate', formData.expiryDate);
    formDataToSend.append('issuerName', formData.issuerName);
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }

    try {
      const res = await fetch('http://localhost:5001/api/credentials/request', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit credential request.');
    }
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
          <div className="form-group">
            <label htmlFor="credentialType">Credential Type</label>
            <select name="credentialType" value={formData.credentialType} onChange={handleChange}>
              <option value="">Select Credential Type</option>
              <option value="Degree">Degree</option>
              <option value="Certificate">Certificate</option>
              <option value="ID Card">ID Card</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issuerName">Issuer Name</label>
            <input
              type="text"
              name="issuerName"
              placeholder="Issuer Name"
              value={formData.issuerName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="issuerDID">Issuer DID</label>
            <input
              type="text"
              name="issuerDID"
              placeholder="Issuer DID"
              value={formData.issuerDID}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="credentialID">Credential ID</label>
            <input
              type="text"
              name="credentialID"
              placeholder="Credential ID"
              value={formData.credentialID}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="issueDate">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <label className="file-upload">
              <span>Select File</span>
              <Upload size={18} />
              <input type="file" name="file" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} />
            </label>
          </div>

          <p className="form-note">Please complete all required fields</p>
          <button type="submit" className="submit-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage_AddCre;