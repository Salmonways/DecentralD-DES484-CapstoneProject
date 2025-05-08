import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage_Issuer.css";

const RegisterPage_Issuer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    domain: "",
    organizationEmail: "",
    country: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    issuerDID: "",
    publicKey: "",
    dnsToken: "xyz123abc",
    logo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) form.append(key, value);
    });

    
    const password = prompt("Set a password for admin login:");
    form.append('password', password);

    const response = await fetch('http://localhost:5001/api/issuer/register', {
        method: 'POST',
        body: form
    });

    const data = await response.json();
    if (response.ok) {
        alert("Registration submitted!.");
        navigate("/issuerlogin");
    } else {
        alert("Registration failed: " + data.error);
    }
};


  return (
    <div className="page-wrapper">


      {/* Registration Container */}
      <div className="register-issuer-container">

        <div className="register-issuer-box">
            <div className="registerissuer-login-tabs">
                <Link to="/issuerlogin" className="login-tab">Login</Link>
                <button className="login-tab active">Register</button>
            </div>
          <h2 className="register-issuer-title">Register as an Issuer</h2>
          <form className="register-issuer-form" onSubmit={handleSubmit}>
            <h3>Organization Information</h3>
            <input name="organizationName" type="text" placeholder="Organization Name" value={formData.organizationName} onChange={handleChange} required />
            <input name="organizationType" type="text" placeholder="Organization Type (University, NGO...)" value={formData.organizationType} onChange={handleChange} required />
            <input name="domain" type="text" placeholder="Website Domain (e.g. tu.ac.th)" value={formData.domain} onChange={handleChange} required />
            <input name="organizationEmail" type="email" placeholder="Official Email" value={formData.organizationEmail} onChange={handleChange} required />
            <input name="country" type="text" placeholder="Country / Region" value={formData.country} onChange={handleChange} required />

            <h3>Admin Contact Info</h3>
            <input name="adminName" type="text" placeholder="Full Name of Admin" value={formData.adminName} onChange={handleChange} required />
            <input name="adminEmail" type="email" placeholder="Admin Email Address" value={formData.adminEmail} onChange={handleChange} required />
            <input name="adminPhone" type="text" placeholder="Phone Number (Optional)" value={formData.adminPhone} onChange={handleChange} />

            <h3>Decentralized Identity (DID)</h3>
            <input name="issuerDID" type="text" placeholder="Requested Issuer DID (or leave blank to auto-generate)" value={formData.issuerDID} onChange={handleChange} />


            <h3>Organization Logo (Optional)</h3>
            <input name="logo" type="file" accept="image/*" onChange={handleChange} />

            <button type="submit" className="register-issuer-btn">Submit Registration</button>
          </form>
        </div>
            <div className="back-button-wrapper">
            <Link to="/" className="bottom-left-back-btn">← Back</Link>
            </div>
      </div>
    </div>
  );
};

export default RegisterPage_Issuer;