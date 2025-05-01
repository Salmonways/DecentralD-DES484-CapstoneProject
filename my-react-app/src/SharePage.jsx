import { QRCode } from "react-qrcode-logo"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./SharePage.css"

const SharePage = () => {
  const navigate = useNavigate()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [verificationLink, setVerificationLink] = useState("")
  const [credentials, setCredentials] = useState([])

  const did = localStorage.getItem("did")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/credentials/requests/${did}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch credentials");

        const data = await res.json();
        setCredentials(data);
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };

    if (did && token) fetchCredentials();
  }, [did, token]);

  useEffect(() => {
    if (selectedCredential) {
      generateQrCode(selectedCredential)
    }
  }, [selectedCredential])

  const generateQrCode = async (credentialId) => {
    setIsGenerating(true);
  
    setTimeout(async () => {
      const cred = credentials.find((c) => c.id === credentialId);
      const verificationId = `cred-${credentialId}-${Date.now()}`;
      const link = `/verificationresult/${verificationId}`;
  
      const fullCredential = {
        id: cred.id,
        title: cred.issuerName,
        type: cred.credentialType,
        status: cred.status,
        image: `http://localhost:5001${cred.filePath}`,
        details: {
          credential: cred.credentialType,
          issuer: cred.issuerName,
          issueDate: cred.requestedDate,
          name: cred.subjectDID,
          description: cred.description,           // optional: populate if available
          blockchainTx: "Pending issuance"
        }
      };
  
      // Store on backend
      await fetch('http://localhost:5001/api/verification/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: verificationId,
          credential: fullCredential,
        }),
      });
  
      // Store in sessionStorage for instant redirect
      sessionStorage.setItem('verificationData', JSON.stringify({
        id: verificationId,
        credential: fullCredential,
      }));
  
      setVerificationLink(link);
      setIsGenerating(false);
    }, 500);
  };

  const handleCheckboxChange = () => {
    setAcceptTerms(!acceptTerms)
  }

  const handlePrivacyToggle = () => {
    setPrivacyMode(!privacyMode)
  }

  const handleCredentialSelect = (credentialId) => {
    if (selectedCredential === credentialId) return
    setSelectedCredential(credentialId)
    console.log(`Selected credential ID: ${credentialId}`)
  }

  const handleShareNow = () => {
    if (acceptTerms && selectedCredential) {
      console.log(`Sharing credential ID: ${selectedCredential}`)
      setShowPopup(true)
    } else if (!acceptTerms) {
      alert("Please accept the terms to share credentials")
    } else {
      alert("Please select a credential to share")
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  const handleGoToVerification = () => {
    navigate(verificationLink)
  }

  const handleCopyLink = () => {
    const fullLink = window.location.origin + verificationLink
    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const selectedCredentialData = selectedCredential ? credentials.find((c) => c.id === selectedCredential) : null

  const renderQRCode = () => {
    if (!selectedCredential || !verificationLink) return null
    const fullLink = window.location.origin + verificationLink
    return (
      <div className="qr-code-container">
        <QRCode value={fullLink} size={180} fgColor="#000000" bgColor="#ffffff" />
        <div className="qr-caption">Scan to verify</div>
      </div>
    )
  }

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item" onClick={() => navigate("/homepage")}>HOME</span>
        <span className="nav-item" onClick={() => navigate("/walletpage")}>WALLET</span>
        <span className="nav-item active" onClick={() => navigate("/sharepage")}>SHARE</span>
        <span className="nav-item" onClick={() => navigate("/settingpage")}>SETTING</span>
      </nav>

      <h1 className="wallet-title">SHARE CREDENTIALS</h1>

      <div className="share-container">
        <div className="credentials-section">
          <div className="credential-selector">
            <div className="selector-header">
              <h2>SELECT CREDENTIAL</h2>
              <span className="arrow">›</span>
            </div>

            <div className="credential-table">
              <div className="table-header">
                <div className="column title-column">TITLE</div>
                <div className="column description-column">DESCRIPTION</div>
                <div className="column status-column">STATUS</div>
              </div>

              {credentials.map((credential) => (
                <div
                  key={credential.id}
                  className={`credential-row ${selectedCredential === credential.id ? "selected" : ""}`}
                  onClick={() => handleCredentialSelect(credential.id)}
                >
                  <div className="column title-column">
                    <div className="credential-logo">
                      <img src={`http://localhost:5001${credential.filePath}`} alt={credential.issuerName} />
                    </div>
                  </div>
                  <div className="column description-column">
                    <div className="credential-details">
                      <p className="credential-type">Type: {credential.credentialType}</p>
                      <p className="credential-info">Reason: {credential.description || "N/A"}</p>
                    </div>
                  </div>
                  <div className="column status-column">
                    <div className={`credential-status ${credential.status.toLowerCase()}`}>{credential.status.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="qr-section">
          <div className={`qr-code ${!selectedCredential ? "inactive" : ""} ${isGenerating ? "generating" : ""}`}>
            {isGenerating ? (
              <div className="generating-indicator">Generating...</div>
            ) : selectedCredential ? (
              <div className="qr-code-display">{renderQRCode()}</div>
            ) : (
              <div className="no-qr-message">Select a credential to generate QR code</div>
            )}
          </div>

          <div className="terms-section">
            <label className="terms-checkbox">
              <input type="checkbox" checked={acceptTerms} onChange={handleCheckboxChange} />
              <span className="checkmark"></span>I accept the terms
            </label>

            <button className="privacy-toggle" onClick={handlePrivacyToggle}>
              Privacy Mode ({privacyMode ? "On" : "Off"})
            </button>
          </div>
        </div>
      </div>

      <button
        className="share-button"
        onClick={handleShareNow}
        disabled={!acceptTerms || !selectedCredential || isGenerating}
      >
        {isGenerating ? "GENERATING QR CODE..." : "SHARE NOW"}
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Credential Shared Successfully!</h2>
            <p>Your credential has been shared. Use the link below to access the verification page:</p>
            <div className="popup-qr">{renderQRCode()}</div>
            <div className="verification-link-container">
              <p className="verification-link-label">Verification Link:</p>
              <div className="verification-link-box">
                <span className="verification-link-text">{window.location.origin + verificationLink}</span>
                <button className="copy-button" onClick={handleCopyLink}>Copy</button>
              </div>
            </div>
            <div className="popup-buttons">
              <button onClick={handleGoToVerification} className="primary-button">View Verification</button>
              <button onClick={handleClosePopup} className="secondary-button">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharePage
