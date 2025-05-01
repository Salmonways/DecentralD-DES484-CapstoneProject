import React, { useEffect, useState } from 'react';
import './DashboardPage_Issuer.css';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage_Issuer = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalIssued: 0,
    totalPending: 0,
    totalRevoked: 0,
    recentActivities: [],
  });

  const adminEmail = localStorage.getItem('adminEmail');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/issuer/summary?email=${adminEmail}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch issuer summary:', err);
      }
    };

    if (adminEmail) fetchSummary();
  }, [adminEmail]);

  return (
    <div className="issuer-dashboard">
      <nav className="issuer-nav">
        <span className="active" onClick={() => navigate('/issuerdashboard')}>HOME</span>
        <span onClick={() => navigate('/issuernew')}>ISSUE CREDENTIAL</span>
        <span onClick={() => navigate('/issuerrevoke')}>REVOKE CREDENTIAL</span>
      </nav>

      <div className="issuer-box">
        <h1 className="issuer-welcome">WELCOME, Issuer</h1>

        <h2 className="issuer-subtitle">SUMMARY CARDS <span className="arrow">→</span></h2>

        <div className="issuer-cards-container">
          <div className="issuer-summary-card">
            <h3>Summary Overview</h3>
            <div className="issuer-card-item">
              <Star size={24} />
              <div>
                <span>Total Issued Credentials</span>
                <p className="issuer-desc">Credentials successfully issued and verified</p>
              </div>
              <span className="issuer-count">{summary.totalIssued}</span>
            </div>

            <div className="issuer-card-item">
              <Star size={24} />
              <div>
                <span>Not Found</span>
                <p className="issuer-desc">Waiting for user to issue the credential</p>
              </div>
              <span className="issuer-count">{summary.totalPending}</span>
            </div>

            <div className="issuer-card-item">
              <Star size={24} />
              <div>
                <span>Revoked Credentials</span>
                <p className="issuer-desc">Credentials that were revoked</p>
              </div>
              <span className="issuer-count">{summary.totalRevoked}</span>
            </div>
          </div>

          <div className="issuer-recent-card">
            <h3>Recent Activity</h3>
            {summary.recentActivities.map((item, idx) => (
              <div className="issuer-activity" key={idx}>
                <div>
                  <strong>{item.issuerName}</strong>
                  <p>{item.credentialType}</p>
                </div>
                <span>{new Date(item.issueDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="issuer-logout-btn" onClick={() => navigate('/')}>Logout</button>
    </div>
  );
};

export default DashboardPage_Issuer;