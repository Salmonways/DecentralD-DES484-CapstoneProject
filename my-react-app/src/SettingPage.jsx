import React, { useState, useEffect } from 'react';
import './SettingPage.css';
import { useNavigate } from 'react-router-dom';

const SettingPage = () => {
  const navigate = useNavigate();
  const [did, setDid] = useState(localStorage.getItem('did'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const [privacy, setPrivacy] = useState(true);
  const [credentialVisibility, setCredentialVisibility] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCred, setNotifCred] = useState(true);
  const [notifShare, setNotifShare] = useState(false);
  const [notifSystem, setNotifSystem] = useState(true);

  const [language, setLanguage] = useState('English');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [twoFA, setTwoFA] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/user/${did}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsername(data.username || '');
        setFullname(data.fullName || '');
        setEmail(data.email || '');
        setDob(data.dateOfBirth || '');
        setNationality(data.nationality || '');
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/settings/${did}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBio(data.bio || '');
        setPrivacy(data.privacy);
        setCredentialVisibility(data.credentialVisibility);
        setDiscoverable(data.discoverable);
        setNotifEmail(data.notifEmail);
        setNotifCred(data.notifCred);
        setNotifShare(data.notifShare);
        setNotifSystem(data.notifSystem);
        setLanguage(data.language);
        setBlockedUsers(data.blockedUsers || []);
        setConnectedWallets(data.connectedWallets || []);
        setTwoFA(data.twoFA);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchUserInfo();
    fetchSettings();
  }, [did, token]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicture(file);
  };

  const unblockUser = (did) => {
    setBlockedUsers(blockedUsers.filter(user => user !== did));
  };

  const disconnectWallet = (wallet) => {
    setConnectedWallets(connectedWallets.filter(w => w !== wallet));
  };

  const handleSaveChanges = async () => {
    try {
      // Save user profile
      await fetch('http://localhost:5001/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did, username, fullname, email, date_of_birth: dob, nationality })
      });

      // Save settings
      const formData = new FormData();
      formData.append('did', did);
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('privacy', privacy);
      formData.append('credentialVisibility', credentialVisibility);
      formData.append('discoverable', discoverable);
      formData.append('notifEmail', notifEmail);
      formData.append('notifCred', notifCred);
      formData.append('notifShare', notifShare);
      formData.append('notifSystem', notifSystem);
      formData.append('language', language);
      formData.append('blockedUsers', JSON.stringify(blockedUsers));
      formData.append('connectedWallets', JSON.stringify(connectedWallets));
      formData.append('twoFA', twoFA);
      if (profilePicture) formData.append('profilePicture', profilePicture);

      await fetch('http://localhost:5001/api/settings/save', {
        method: 'POST',
        body: formData
      });

      // Change password if provided
      if (currentPassword && newPassword) {
        const passwordRes = await fetch('http://localhost:5001/api/user/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ did, oldPassword: currentPassword, newPassword })
        });

        if (!passwordRes.ok) {
          const errMsg = await passwordRes.json();
          alert(`Password change failed: ${errMsg.error}`);
        } else {
          alert('Password changed successfully.');
        }
      }

      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="wallet-wrapper">
      <nav className="wallet-nav">
        <span className="nav-item" onClick={() => navigate('/homepage')}>HOME</span>
        <span className="nav-item" onClick={() => navigate('/walletpage')}>WALLET</span>
        <span className="nav-item" onClick={() => navigate('/sharepage')}>SHARE</span>
        <span className="nav-item active">SETTING</span>
      </nav>

      <h1 className="setting-title">ACCOUNT SETTINGS</h1>

      <div className="setting-section">
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePictureChange} />
        {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="profile-preview" />}

        <label>Username:</label>
        <input type="text" placeholder={username} value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Full Name:</label>
        <input type="text" placeholder={fullname} value={fullname} onChange={(e) => setFullname(e.target.value)} />

        <label>Email:</label>
        <input type="email" placeholder={email} value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Date of Birth:</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

        <label>Nationality:</label>
        <input type="text" placeholder={nationality} value={nationality} onChange={(e) => setNationality(e.target.value)} />
      </div>





      <div className="setting-section">
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Thai</option>
          <option>Spanish</option>
        </select>
      </div>



      <div className="setting-section">
        <label>Connected Wallets / DIDs:</label>
        {connectedWallets.map((wallet) => (
          <div key={wallet} className="wallet-item">
            {wallet} <button onClick={() => disconnectWallet(wallet)}>Disconnect</button>
          </div>
        ))}
      </div>

      <div className="setting-section">
        <label>Change Password:</label>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="setting-section danger">
        <label>Danger Zone:</label>

        <button
          className="danger-btn"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
        >
          Log Out
        </button>
      </div>

      <div className="setting-section">
        <button className="save-btn" onClick={handleSaveChanges}>SAVE CHANGES</button>
      </div>
    </div>
  );
};

export default SettingPage;
