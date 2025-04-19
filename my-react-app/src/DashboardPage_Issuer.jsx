import React from 'react';
import './DashboardPage_Issuer.css';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage_Issuer = () => {
    const navigate = useNavigate();

  return (
    <div className="issuer-dashboard">
      <nav className="issuer-nav">
        <span  className="active" onClick={() => navigate('/issuerdashboard')}>HOME</span>
        <span  onClick={() => navigate('/issuernew')}>ISSUE CREDENTIAL</span>
        <span  onClick={() => navigate('/issuerrevoke')}>REVOKE CREDENTIAL</span>
      </nav>
    <div className="issuer-box">

      <h1 className="issuer-welcome">WELCOME, [Issuer Name]</h1>

      <h2 className="issuer-subtitle">
        SUMMARY CARDS <span className="arrow">→</span>
      </h2>

      <div className="issuer-cards-container">
        <div className="issuer-summary-card">
          <h3>Summary Overview</h3>
          <div className="issuer-card-item">
            <Star size={24} />
            <div>
              <span>Total Issued Credentials</span>
              <p className="issuer-desc">Credentials successfully issued and verified</p>
            </div>
            <span className="issuer-count">152</span>
          </div>

          <div className="issuer-card-item">
            <Star size={24} />
            <div>
              <span>Pending Credentials</span>
              <p className="issuer-desc">Waiting for approval or review</p>
            </div>
            <span className="issuer-count">8</span>
          </div>

          <div className="issuer-card-item">
            <Star size={24} />
            <div>
              <span>Revoked Credentials</span>
              <p className="issuer-desc">Credentials that were revoked</p>
            </div>
            <span className="issuer-count">5</span>
          </div>
        </div>

        <div className="issuer-recent-card">
          <h3>Recent Activity</h3>
          <div className="issuer-activity">
            <div>
              <strong>Bachelor Degree - TU</strong>
              <p>did:dec:0x4a23f9c...789</p>
            </div>
            <span>15 Oct 2023</span>
          </div>
          <div className="issuer-activity">
            <div>
              <strong>TOEIC Result</strong>
              <p>did:dec:0x81236ab...123</p>
            </div>
            <span>12 Oct 2023</span>
          </div>
          <div className="issuer-activity">
            <div>
              <strong>Data Science Certificate</strong>
              <p>did:dec:0x1789afe...555</p>
            </div>
            <span>10 Oct 2023</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardPage_Issuer;