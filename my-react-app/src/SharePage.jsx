import { QRCode } from "react-qrcode-logo"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./SharePage.css"

const SharePage = () => {
  const navigate = useNavigate()
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
        const activeOnly = data.filter(c => c.status === 'active');
        setCredentials(activeOnly);
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

  const cred = credentials.find((c) => c.id === credentialId);
  if (!cred) {
    console.error("Credential not found!");
    setIsGenerating(false);
    return;
  }

  const verificationId = cred.credentialID; 
  const link = `/verificationresult/${verificationId}`;
  
  sessionStorage.setItem("verificationData", JSON.stringify({ id: verificationId, credential: cred }));

  setVerificationLink(link);
  setIsGenerating(false);
};





  const handleCredentialSelect = (credentialId) => {
    if (selectedCredential === credentialId) return
    setSelectedCredential(credentialId)
    console.log(`Selected credential ID: ${credentialId}`)
  }

  const handleShareNow = () => {
    if ( selectedCredential) {
      console.log(`Sharing credential ID: ${selectedCredential}`)
      setShowPopup(true)
    }  else {
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
            </label>


          </div>
        </div>
      </div>

      <button
        className="share-button"
        onClick={handleShareNow}
        disabled={ !selectedCredential || isGenerating}
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
