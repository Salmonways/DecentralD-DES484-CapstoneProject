import placeholderImg from './assets/TU.png';
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./VerificationResult.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getContract } from './utils/blockchain';

const VerificationResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onChainValid, setOnChainValid] = useState(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      const res = await fetch(`http://localhost:5001/api/verification/detail/${id}`);
      if (!res.ok) {
        setLoading(false);
        return setCredential(null);
      }
  
      const data = await res.json();
      setCredential(data);
      setLoading(false);
    };
  
    fetchVerificationData();
  }, [id]);

  useEffect(() => {
    const checkOnChainValidity = async () => {
      if (!credential?.credentialID) return;
      try {
        const contract = await getContract();
        const valid = await contract.isCredentialValid(credential.credentialID);
        setOnChainValid(valid);
      } catch (err) {
        console.error("Blockchain check error:", err);
        setOnChainValid(false);
      }
    };

    checkOnChainValidity();
  }, [credential]);

  const handleDownload = async () => {
    const element = document.querySelector(".verification-container");
    if (!element) return alert("Nothing to export!");

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("verified_credential.pdf");
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  if (loading) return <div className="loading">Loading credential...</div>;
  if (!credential) {
    return (
      <div className="verification-error">
        <h2>Verification Failed</h2>
        <p>The verification link is invalid or expired.</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const {
    credentialType,
    issuerName,
    created_at,
    credentialID,
    description,
    filePath,
    status
  } = credential;

  const safeDate = created_at ? new Date(created_at).toLocaleDateString() : "N/A";
  const safeStatus = status || "unknown";

  return (
    <div className="wallet-wrapper">
      <nav className="verification-nav-result">
        <span className="nav-item" onClick={() => navigate("/verificationhome")}>VERIFY CREDENTIAL</span>
        <span className="nav-item active">VERIFICATION RESULTS</span>
      </nav>

      <h1 className="wallet-title">VERIFICATION RESULT</h1>

      <div className="verification-container">
        <div className="credential-card">
          <div className="credential-image">
            <img
              src={filePath ? `http://localhost:5001${filePath}` : placeholderImg}
              alt="Issuer logo"
              className="issuer-logo"
              onError={(e) => (e.target.src = placeholderImg)}
            />
          </div>
          <div className="credential-status-box">
            <div className="credential-name">{issuerName || credentialType || "Credential Title"}</div>
            <div className="credential-status">
              Status:{" "}
              <span className={safeStatus === 'active' ? 'verified' : 'rejected'}>
                {safeStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="credential-details">
          <h2>{credentialType?.toUpperCase() || "Credential Details"}</h2>
          <div className="detail-item"><strong>Credential Type: </strong> {credentialType || "N/A"}</div>
          <div className="detail-item"><strong>Issuer: </strong> {issuerName || "N/A"}</div>
          <div className="detail-item"><strong>Issue Date: </strong> {safeDate}</div>
          <div className="detail-item"><strong>Credential ID: </strong> {credentialID || "N/A"}</div>
          <div className="detail-item"><strong>Description: </strong> {description || "N/A"}</div>
          <div className="detail-item">
            <strong>On-Chain Status: </strong>
            <span className="detail-value">
              {onChainValid === null ? "Checking..." : onChainValid ? "✅ Already on chain" : "❌ Invalid or Not Found"}
            </span>
          </div>
        </div>
      </div>

      <div className="download-section">
        <a href="#" className="download-link" onClick={(e) => e.preventDefault()}>
          Download Verified Copy (PDF)
        </a>
        <button className="download-button" onClick={handleDownload}>DOWNLOAD</button>
      </div>

      <button className="bottom-left-back-btn" onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
};

export default VerificationResult;

