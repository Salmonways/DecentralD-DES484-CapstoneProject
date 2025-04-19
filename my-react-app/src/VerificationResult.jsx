import placeholderImg from './assets/TU.png'; // adjust path accordingly
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./VerificationResult.css"

const VerificationResult = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [verificationData, setVerificationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For this demo, we'll retrieve it from sessionStorage
    const storedData = sessionStorage.getItem("verificationData")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setVerificationData(parsedData)
      } catch (error) {
        console.error("Error parsing verification data:", error)
      }
    }

    setLoading(false)
  }, [id])

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert("PDF download would start in a real application")
  }

  if (loading) {
    return <div className="loading">Loading verification data...</div>
  }

  if (!verificationData || !verificationData.credential) {
    return (
      <div className="verification-error">
        <h2>Verification Failed</h2>
        <p>The verification link is invalid or has expired.</p>
        <Link to="/">Return to Home</Link>
      </div>
    )
  }

  const { credential } = verificationData
  const details = credential.details || {}

  return (
    <div className="wallet-wrapper">
      <nav className="verification-nav">
        <span className="nav-item" onClick={() => navigate("/verificationhome")}>
          VERIFY CREDENTIAL
        </span>
        <span className="nav-item active" onClick={() => navigate("/verificationresult/:id")}>
          VERIFICATION RESULTS
        </span>

      </nav>

      <h1 className="wallet-title">VERIFICATION RESULT</h1>

      <div className="verification-container">
        <div className="credential-card">
          <div className="credential-image">
            <img src={credential.image || placeholderImg} alt={credential.title} />
          </div>
          <div className="credential-status-box">
            <div className="credential-name">{details.credential || "Bachelor Degree - TU"}</div>
            <div className="credential-status">
              Status: <span className="verified">✓ Verified</span>
            </div>
          </div>
        </div>

        <div className="credential-details">
          <h2>{details.credential || "BACHELOR DEGREE - TU"}</h2>

          <div className="detail-item">
            <span className="detail-label">Credential:</span>
            <span className="detail-value">{details.credential || "Bachelor Degree - TU"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Issuer:</span>
            <span className="detail-value">{details.issuer || "Thammasat University"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Issue Date:</span>
            <span className="detail-value">{details.issueDate || "15 October 2023"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{details.name || "Naphattra P."}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Program:</span>
            <span className="detail-value">{details.program || "Computer Engineering"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">GPA:</span>
            <span className="detail-value">{details.gpa || "3.65"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Blockchain Tx:</span>
            <span className="detail-value">{details.blockchainTx || "0x452ef... confirmed on Oct 15, 2023"}</span>
          </div>
        </div>
      </div>

      <div className="download-section">
        <a
          href="#"
          className="download-link"
          onClick={(e) => {
            e.preventDefault()
          }}
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
  )
}

export default VerificationResult
