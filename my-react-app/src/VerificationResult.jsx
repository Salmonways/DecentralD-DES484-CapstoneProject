import placeholderImg from './assets/TU.png';
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./VerificationResult.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const VerificationResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("verificationData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.id === id) {
          setVerificationData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing verification data:", error);
      }
    }
    setLoading(false);
  }, [id]);

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
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Error generating PDF.");
    }
  };

  if (loading) {
    return <div className="loading">Loading verification data...</div>;
  }

  if (!verificationData || !verificationData.credential) {
    return (
      <div className="verification-error">
        <h2>Verification Failed</h2>
        <p>The verification link is invalid or has expired.</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const { credential } = verificationData;
  const {
    title,
    image,
    status,
    type,
    details = {}
  } = credential;

  const {
    credential: credTitle,
    issuer,
    issueDate,
    name,
    description,
    blockchainTx
  } = details;

  return (
    <div className="wallet-wrapper">
      <nav className="verification-nav-result">
        <span className="nav-item" onClick={() => navigate("/verificationhome")}>
          VERIFY CREDENTIAL
        </span>
        <span className="nav-item active">
          VERIFICATION RESULTS
        </span>
      </nav>

      <h1 className="wallet-title">VERIFICATION RESULT</h1>

      <div className="verification-container">
        <div className="credential-card">
          <div className="credential-image">
            <img src={image || placeholderImg} alt={title || "Credential"} />
          </div>
          <div className="credential-status-box">
            <div className="credential-name">{issuer || title || "Credential Title"}</div>
            <div className="credential-status">
              Status: <span className="verified">{status || "✓ Verified"}</span>
            </div>
          </div>
        </div>

        <div className="credential-details">
          <h2>{credTitle || title || "Credential Details"}</h2>

          <div className="detail-item">
            <span className="detail-label">Credential Type:</span>
            <span className="detail-value">{type || "Unknown"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Issuer:</span>
            <span className="detail-value">{issuer || "Unknown Issuer"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Issue Date:</span>
            <span className="detail-value">{issueDate || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{name || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{description || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Blockchain Tx:</span>
            <span className="detail-value">{blockchainTx || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="download-section">
        <a
          href="#"
          className="download-link"
          onClick={(e) => e.preventDefault()}
        >
          Download Verified Copy (PDF)
        </a>
        <button className="download-button" onClick={handleDownload}>
          DOWNLOAD
        </button>
      </div>

      <button className="bottom-left-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};

export default VerificationResult;
