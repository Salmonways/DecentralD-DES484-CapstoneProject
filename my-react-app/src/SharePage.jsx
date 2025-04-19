import { QRCode } from "react-qrcode-logo"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./SharePage.css"
import toeicImg from "./assets/TOEIC.png"
import tuImg from "./assets/TU.png"

const SharePage = () => {
  const navigate = useNavigate()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [verificationLink, setVerificationLink] = useState("")

  // Credential data
  const credentials = [
    {
      id: 1,
      title: "TOEIC",
      image: toeicImg,
      type: "Scores",
      info: "Score: 895, Issued: Sept 2024",
      status: "VERIFIED",
    },
    {
      id: 2,
      title: "Thammasat University",
      image: tuImg,
      type: "University",
      info: "Thammasat University, Graduated Oct 2024",
      status: "VERIFIED",
      details: {
        credential: "Bachelor Degree - TU",
        issuer: "Thammasat University",
        issueDate: "15 October 2023",
        name: "Naphattra P.",
        program: "Computer Engineering",
        gpa: "3.65",
        blockchainTx: "0x452ef... confirmed on Oct 15, 2023",
      },
    },
  ]

  // Generate QR code when a credential is selected
  useEffect(() => {
    if (selectedCredential) {
      generateQrCode(selectedCredential)
    }
  }, [selectedCredential])

  // Simulate QR code generation
  const generateQrCode = (credentialId) => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate a verification link
      const credential = credentials.find((c) => c.id === credentialId)
      const verificationId = `cred-${credentialId}-${Date.now()}`
      const link = `/verificationresult/${verificationId}`

      // Store the link and credential info in sessionStorage for the verification page
      sessionStorage.setItem(
        "verificationData",
        JSON.stringify({
          id: verificationId,
          credential: credential,
        }),
      )

      setVerificationLink(link)
      setIsGenerating(false)
    }, 500) // Short delay to simulate generation
  }

  const handleCheckboxChange = () => {
    setAcceptTerms(!acceptTerms)
  }

  const handlePrivacyToggle = () => {
    setPrivacyMode(!privacyMode)
  }

  const handleCredentialSelect = (credentialId) => {
    // If already selected, do nothing
    if (selectedCredential === credentialId) return

    // Set the selected credential
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

  // Get the selected credential data
  const selectedCredentialData = selectedCredential ? credentials.find((c) => c.id === selectedCredential) : null

  // Create a simple QR code pattern
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
        <span className="nav-item" onClick={() => navigate("/homepage")}>
          HOME
        </span>
        <span className="nav-item" onClick={() => navigate("/walletpage")}>
          WALLET
        </span>
        <span className="nav-item active" onClick={() => navigate("/sharepage")}>
          SHARE
        </span>
        <span className="nav-item" onClick={() => navigate("/settingpage")}>
          SETTING
        </span>
      </nav>

      <h1 className="wallet-title">SHARE CREDENTIALS</h1>

      <div className="share-container">
        <div className="credentials-section">
          <div className="credential-selector">
            <div className="selector-header">
              <span>SELECT CREDENTIAL</span>
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
                      <img src={credential.image || "/placeholder.svg"} alt={credential.title} />
                    </div>
                  </div>
                  <div className="column description-column">
                    <div className="credential-details">
                      <p className="credential-type">{credential.type}</p>
                      <p className="credential-info">{credential.info}</p>
                    </div>
                  </div>
                  <div className="column status-column">
                    <div className={`credential-status ${credential.status.toLowerCase()}`}>{credential.status}</div>
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

      {/* Share Popup */}
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
                <button className="copy-button" onClick={handleCopyLink}>
                  Copy
                </button>
              </div>
            </div>

            <div className="popup-buttons">
              <button onClick={handleGoToVerification} className="primary-button">
                View Verification
              </button>
              <button onClick={handleClosePopup} className="secondary-button">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
    
  )
}

export default SharePage
