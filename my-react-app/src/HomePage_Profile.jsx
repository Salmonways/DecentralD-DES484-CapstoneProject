import React, { useEffect, useState } from 'react';
import './HomePage_Profile.css';
import { useNavigate } from 'react-router-dom';
import IDImg from './assets/ID.png'; // adjust if your path is different

const userDID = localStorage.getItem('did'); // Assuming you save the DID at login

const HomePage_Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/profile/${userDID}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile({
          fullName: data.fullName || "",
          username: data.username || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
          nationality: data.nationality || "",
          email: data.email || ""
        });
      } catch (e) {
        setMsg(e.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`http://localhost:5001/api/profile/${userDID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }
      setMsg("Profile updated!");
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item active" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item" onClick={() => navigate('/settingpage')}>SETTING</span>
      </nav>
      <h1 className="wallet-title">YOUR PROFILE</h1>
      <div className="wallet-id-card profile-mode">
        <img src={IDImg} alt="ID Card" />
      </div>
      <div className="profile-box">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-row">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-row">
              <label>Username / Display Name</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>
            <div className="form-row">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                value={profile.nationality}
                onChange={handleChange}
                placeholder="Enter nationality"
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <button type="submit" className="edit-button">Save Changes</button>
            {msg && <div style={{ color: msg === "Profile updated!" ? "green" : "red", marginTop: 8 }}>{msg}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage_Profile;
