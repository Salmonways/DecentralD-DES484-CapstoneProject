import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VerificationHome.css";

const VerificationHome = () => {
  const navigate = useNavigate();
  const [verificationInput, setVerificationInput] = useState("");
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    const verificationData = sessionStorage.getItem("verificationData");
    if (verificationData) {
      setHasVerified(true);
    }
  }, []);

  const handleInputChange = (e) => {
    setVerificationInput(e.target.value);
  };

  const handleVerify = async () => {
    if (!verificationInput.trim()) {
      alert("Please enter a verification link or ID");
      return;
    }
  
    try {
      const input = verificationInput.trim();
      const match = input.match(/\/verificationresult\/(.+)$/);
      const verificationId = match ? match[1] : input; // Use just the ID if already clean
  
      const res = await fetch(`http://localhost:5001/api/verification/${verificationId}`);
      if (!res.ok) throw new Error("Credential not found or expired");
  
      const { id, credential } = await res.json();
  
      sessionStorage.setItem("verificationData", JSON.stringify({ id, credential }));
      navigate(`/verificationresult/${id}`);
    } catch (err) {
      alert("Verification failed: " + err.message);
    }
  };


  const handleResultNavClick = () => {
    if (!hasVerified) {
      alert("Please verify a credential first before viewing results");
    } else {
      const verificationData = JSON.parse(sessionStorage.getItem("verificationData"));
      navigate(`/verificationresult/${verificationData.id}`);
    }
  };

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setVerificationInput(text);
      })
      .catch((err) => {
        console.error("Failed to read clipboard: ", err);
      });
  };

  return (
    <div className="verify-page-wrapper">
      <div className="verify-nav-container">
        <nav className="verification-nav">
          <span className="nav-item active">VERIFY CREDENTIAL</span>
          <span className="nav-item" onClick={handleResultNavClick}>
            VERIFICATION RESULT
          </span>
        </nav>
      </div>

      <div className="verify-content">
        <h1 className="verify-title">VERIFY CREDENTIAL</h1>

        <div className="verify-input-container">
          <input
            type="text"
            className="verify-input"
            placeholder="Paste verification link"
            value={verificationInput}
            onChange={handleInputChange}
          />
          <button className="paste-button" onClick={handlePaste} aria-label="Paste from clipboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
        </div>

        <div className="verify-button-container">
          <button className="verify-button" onClick={handleVerify}>
            VERIFY NOW
          </button>
        </div>

        <div className="back-button-container">
          <button className="bottom-left-back-btn" onClick={() => navigate("/")}>← Back</button>
        </div>
      </div>
    </div>
  );
};

export default VerificationHome;
