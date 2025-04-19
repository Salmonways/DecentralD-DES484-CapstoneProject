import React, { useState } from 'react';
import './SettingPage.css';
import { useNavigate } from 'react-router-dom';

const SettingPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('JohnDoe');
  const [bio, setBio] = useState('Decentralized identity enthusiast.');
  const [profilePicture, setProfilePicture] = useState(null);

  const [privacy, setPrivacy] = useState(true);
  const [credentialVisibility, setCredentialVisibility] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCred, setNotifCred] = useState(true);
  const [notifShare, setNotifShare] = useState(false);
  const [notifSystem, setNotifSystem] = useState(true);

  const [language, setLanguage] = useState('English');

  const [blockedUsers, setBlockedUsers] = useState(['did:example:1234', 'did:example:5678']);
  const [connectedWallets, setConnectedWallets] = useState(['MetaMask', 'WalletConnect']);

  const [twoFA, setTwoFA] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const unblockUser = (did) => {
    setBlockedUsers(blockedUsers.filter(user => user !== did));
  };

  const disconnectWallet = (wallet) => {
    setConnectedWallets(connectedWallets.filter(w => w !== wallet));
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

      {/* Profile Info */}
      <div className="setting-section">
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePictureChange} />
        {profilePicture && <img src={profilePicture} alt="Profile" className="profile-preview" />}

        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Bio:</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      {/* Privacy Settings */}
      <div className="setting-section">
        <label>Account Visibility:</label>
        <button onClick={() => setPrivacy(!privacy)}>{privacy ? 'Private 🔒' : 'Public 🌐'}</button>

        <label>Credential Visibility:</label>
        <button onClick={() => setCredentialVisibility(!credentialVisibility)}>
          {credentialVisibility ? 'Visible ✅' : 'Hidden ❌'}
        </button>

        <label>Profile Discoverability:</label>
        <button onClick={() => setDiscoverable(!discoverable)}>
          {discoverable ? 'Discoverable' : 'Hidden'}
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="setting-section">
        <label>Email Notifications:</label>
        <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />

        <label>Credential Alerts:</label>
        <input type="checkbox" checked={notifCred} onChange={() => setNotifCred(!notifCred)} />

        <label>Share Activity Notifications:</label>
        <input type="checkbox" checked={notifShare} onChange={() => setNotifShare(!notifShare)} />

        <label>System Updates:</label>
        <input type="checkbox" checked={notifSystem} onChange={() => setNotifSystem(!notifSystem)} />
      </div>

      {/* Language Preferences */}
      <div className="setting-section">
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Thai</option>
          <option>Spanish</option>
        </select>
      </div>

      {/* Blocked Users */}
      <div className="setting-section">
        <label>Blocked Users:</label>
        {blockedUsers.map((did) => (
          <div key={did} className="blocked-item">
            {did} <button onClick={() => unblockUser(did)}>Unblock</button>
          </div>
        ))}
      </div>

      {/* Connected Wallets */}
      <div className="setting-section">
        <label>Connected Wallets / DIDs:</label>
        {connectedWallets.map((wallet) => (
          <div key={wallet} className="wallet-item">
            {wallet} <button onClick={() => disconnectWallet(wallet)}>Disconnect</button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="setting-section">
        <label>Two-Factor Authentication:</label>
        <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
        <p className="hint">We recommend enabling 2FA for extra security.</p>
      </div>

      {/* Danger Zone */}
      <div className="setting-section danger">
        <label>Danger Zone:</label>
        <button className="danger-btn">Delete Account</button>
        <button className="danger-btn">Reset to Default</button>
        <button
          className="danger-btn"
          onClick={() => {
            localStorage.removeItem('token'); // or whatever key you use
            navigate('/');
          }}
        >
          Log Out
        </button>
      </div>

      {/* Save & Reset */}
      <div className="setting-section">
        <button className="save-btn">SAVE CHANGES</button>
        <button className="reset-btn">RESET SETTINGS</button>
      </div>
    </div>
  );
};

export default SettingPage;