// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { create } = require('ipfs-http-client');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
const path = require('path');

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const app = express();
const port = 5001;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());


// MySQL connection (update credentials as needed)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // your DB user
    password: 'root',       // your DB password (use '' for XAMPP, 'root' for MAMP)
    port: 8889,             // your MySQL port (8889 for MAMP)
    database: 'decentraid', // your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
 
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Contains { did }
    next();
  });
};




const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// ------------------- USER REGISTER API (POST /api/did) -------------------
app.post('/api/did', async (req, res) => {
    const { did, userData, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }
    try {
        const hash = await bcrypt.hash(password, 10);

        const [rows] = await pool.query(
            'INSERT INTO users (did, fullName, username, email, password, user_data) VALUES (?, ?, ?, ?, ?, ?)',
            [
                did,
                userData.fullName,
                userData.username,
                userData.email,
                hash,
                JSON.stringify(userData)
            ]
        );
        res.json({ did });
    } catch (err) {
        console.log('Registration error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'DID, username, or email already exists' });
        } else {
            res.status(500).json({ error: err.message || 'Unknown error' });
        }
    }
});

// ------------------- USER LOGIN API (POST /api/login) -------------------
app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Username/email and password required' });
    }

    const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [usernameOrEmail, usernameOrEmail]
    );

    if (rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ did: user.did }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
        id: user.id,
        did: user.did,
        token, // ⬅️ Send token to frontend
        username: user.username,
        fullName: user.fullName,
        email: user.email
    });
});


// ------------------- FORGOT PASSWORD API (POST /api/forgot-password) -------------------
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        // Check in users table
        const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length > 0) {
            // Here: send a user password reset link (implement as needed)
            return res.json({ message: 'If this email exists, a password reset link will be sent.' });
        }
        // Check in issuers table (adminEmail column)
        const [issuerRows] = await pool.query('SELECT * FROM issuers WHERE adminEmail = ?', [email]);
        if (issuerRows.length > 0) {
            // Here: send an issuer password reset link (implement as needed)
            return res.json({ message: 'A password reset link will be sent.' });
        }
        // Not found in either table
        return res.status(404).json({ error: 'No account found with that email' });
    } catch (err) {
        console.log('Forgot Password error:', err);
        return res.status(500).json({ error: err.message || 'Unknown error' });
    }
});

const { v4: uuidv4 } = require('uuid');
// ------------------- ISSUER REGISTER API (POST /api/issuer/register) -------------------
app.post('/api/issuer/register', upload.single('logo'), async (req, res) => {
  try {
      let {
          organizationName,
          organizationType,
          domain,
          organizationEmail,
          country,
          adminName,
          adminEmail,
          adminPhone,
          issuerDID,
          publicKey,
          dnsToken,
          password
      } = req.body;

      // ✅ Auto-generate issuerDID if empty
      if (!issuerDID || issuerDID.trim() === '') {
          issuerDID = `did:decentrald:${uuidv4()}`;
      }

      const logo = req.file ? req.file.filename : null;
      const hash = await bcrypt.hash(password, 10);

      await pool.query(
          `INSERT INTO issuers
          (organizationName, organizationType, domain, organizationEmail, country, adminName, adminEmail, adminPhone, issuerDID, publicKey, dnsToken, logo, password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              organizationName,
              organizationType,
              domain,
              organizationEmail,
              country,
              adminName,
              adminEmail,
              adminPhone,
              issuerDID,
              publicKey,
              dnsToken,
              logo,
              hash
          ]
      );

      res.json({ message: "Issuer registered successfully!", issuerDID }); // send back the DID
  } catch (err) {
      console.log("Issuer registration error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ error: 'Domain, organization/admin email, or DID already exists' });
      } else {
          res.status(500).json({ error: err.message || 'Unknown error' });
      }
  }
});

// issuer_new fetch info
app.get('/api/issuer/profile', async (req, res) => {
  try {
    const email = req.query.email; // ✅ Move this to the top!

    const [rows] = await pool.query(
      `SELECT issuerDID, organizationName AS issuerName FROM issuers WHERE adminEmail = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Issuer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Issuer profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- ISSUER LOGIN API (POST /api/issuer/login) -------------------
app.post('/api/issuer/login', async (req, res) => {
    let { adminEmail, password } = req.body;

    adminEmail = adminEmail ? adminEmail.trim() : "";
    password = password ? password.trim() : "";

    if (!adminEmail || !password) {
        return res.status(400).json({ error: 'Admin email and password are required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM issuers WHERE adminEmail = ?',
            [adminEmail]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Incorrect admin email' });
        }
        const issuer = rows[0];
        const isMatch = await bcrypt.compare(password, issuer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.json({
            id: issuer.id,
            organizationName: issuer.organizationName,
            adminEmail: issuer.adminEmail,
            issuerDID: issuer.issuerDID,
            domain: issuer.domain
        });
    } catch (err) {
        res.status(500).json({ error: 'Unknown error' });
    }
});


// ------------------- PROFILE GET API (optional, for users) -------------------
app.get('/api/did/:did', async (req, res) => {
    const { did } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE did = ?', [did]);
    if (rows.length === 0) return res.status(404).json({ error: 'DID not found' });
    res.json({
        id: rows[0].id,
        did: rows[0].did,
        username: rows[0].username,
        email: rows[0].email,
        fullName: rows[0].fullName
    });
});

// Get user profile by DID or user ID
app.get('/api/profile/:did', async (req, res) => {
    const { did } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE did = ?', [did]);
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
app.put('/api/profile/:did', async (req, res) => {
    const { did } = req.params;
    const { fullName, username, dateOfBirth, nationality, email } = req.body;
    try {
        await pool.query(
            `UPDATE users SET fullName=?, username=?, dateOfBirth=?, nationality=?, email=? WHERE did=?`,
            [fullName, username, dateOfBirth, nationality, email, did]
        );
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});  
  






// ------------------- CREDENTIALS REQUESTS API (POST /api/credentials/request) -------------------


app.post('/api/credentials/request', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { credentialID, credentialType, description, issueDate, expiryDate, issuerName, issuerDID } = req.body;
    const subjectDID = req.user.did; // ✅ Logged-in user's DID from JWT
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      'INSERT INTO credential_requests (subjectDID, issuerDID, credentialID, credentialType, description, issueDate, expiryDate, filePath, issuerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subjectDID, issuerDID, credentialID, credentialType, description, issueDate, expiryDate, filePath, issuerName]
    );

    res.status(201).json({ message: 'Credential request saved successfully' });
  } catch (error) {
    console.error('Error saving credential request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//homepage fetch credential (active)
app.get('/api/credentials/requests/:did', async (req, res) => {
  console.log("Fetching credentials for DID:", req.params.did);
  const { did } = req.params; // Get the DID from the route parameter
  try {
    const [rows] = await pool.query(
      'SELECT * FROM credential_requests WHERE subjectDID = ? AND status = ? ORDER BY created_at DESC',
      [did, 'active']  // Filter by the logged-in user's DID and the active status
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch active credentials' });
  }
});

//wallet page fetch not found credential 
app.get('/api/credentials/requestsnotfound/:did', async (req, res) => {
  const { did } = req.params;

  const statuses = [
    'not found',
    'meta-data not match',
    'waiting for both issuer and user submission',
    'revoked',
    'duplicate'
  ];

  try {
    const [rows] = await pool.query(
      `SELECT * FROM credential_requests 
       WHERE subjectDID = ? 
       AND status IN (?, ?, ?, ?, ?)
       ORDER BY created_at DESC`,
      [did, ...statuses]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch filtered credentials' });
  }
});


//walletpage_credetails fetch info
app.get('/api/credentials/detail/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM credential_requests WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // ✅ Send the found credential back to the frontend
    res.json(rows[0]);

  } catch (err) {
    console.error('Error fetching credential:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------- CREDENTIALS REQUESTS API (GET /api/credentials/requests) -------------------  
  




async function matchCredentialRequests() {
  const [requests] = await db.query(
    `SELECT * FROM credential_requests WHERE status IS NULL OR status != 'valid'`
  );

  for (const request of requests) {
    const [matches] = await db.query(
      `SELECT * FROM credential 
       WHERE subjectDID = ? AND issuerDID = ? AND credentialType = ? AND issueDate = ? AND issuerName = ?`,
      [
        request.subjectDID,
        request.issuerDID,
        request.credentialType,
        request.issueDate,
        request.issuerName,
      ]
    );

    if (matches.length > 0) {
      const matched = matches[0];
      await db.query(
        `UPDATE credential_requests 
         SET status = 'valid', matched_credential_id = ? 
         WHERE id = ?`,
        [matched.id, request.id]
      );
      console.log(`✅ Matched request ID ${request.id} with credential ID ${matched.id}`);
    } else {
      await db.query(
        `UPDATE credential_requests 
         SET status = 'invalid', matched_credential_id = NULL 
         WHERE id = ?`,
        [request.id]
      );
      console.log(`❌ No match found for request ID ${request.id}`);
    }
  }
}
app.post('/api/submit-request', async (req, res) => {
  try {
    const {
      credentialType,
      issuerName,
      subjectDID,
      issueDate,
      expiryDate,
      reason,
      filePath,
      issuerDID
    } = req.body;

    // Insert request into credential_requests
    await db.query(
      `INSERT INTO credential_requests 
       (credentialType, issuerName, subjectDID, issueDate, expiryDate, reason, filePath, issuerDID) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [credentialType, issuerName, subjectDID, issueDate, expiryDate, reason, filePath, issuerDID]
    );

    // Run matching
    await matchCredentialRequests();

    res.status(200).json({ message: 'Request submitted and matching triggered.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});



// ------------------- CREDENTIALS ISSUE (Issuer_new.jsx) -------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/credentials/issue', upload.single('file'), async (req, res) => {
  console.log('Received file:', req.file); // Log file details
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {


    const {
      title, type, subjectDID, issuerDID, issueDate, expiryDate,
      credentialId, status, issuerName, subjectName,
      description, metadata, tags, schemaUrl,
    } = req.body;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO credentials 
      (credentialTitle, credentialType, subjectDID, issuerDID, issueDate, expiryDate,
       credentialID, status, issuerName, subjectName, description, metadata, tags, schemaUrl, filePath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        type,
        subjectDID,
        issuerDID,
        issueDate,
        expiryDate || null,
        credentialId, // This is the JS variable; it maps to SQL column credentialID
        status || "not found",
        issuerName,
        subjectName || null,
        description || null,
        metadata || null,
        tags || null,
        schemaUrl || null,
        filePath,
      ]
    );

    res.json({ message: 'Credential issued successfully!' });
  } catch (err) {
    console.error('Credential issue error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to issue credential' });
  }
});
  






//issuer dashboard fetch info
app.get('/api/issuer/summary', async (req, res) => {
  const email = req.query.email;
  try {
    const [issuer] = await pool.query('SELECT issuerDID FROM issuers WHERE adminEmail = ?', [email]);
    if (!issuer.length) return res.status(404).json({ error: 'Issuer not found' });

    const issuerDID = issuer[0].issuerDID;

    const [issued] = await pool.query(
      'SELECT COUNT(*) AS total FROM credentials WHERE issuerDID = ?', [issuerDID]
    );
    const [revoked] = await pool.query(
      'SELECT COUNT(*) AS total FROM credentials WHERE issuerDID = ? AND status = "revoked"', [issuerDID]
    );
    const [pending] = await pool.query(
      'SELECT COUNT(*) AS total FROM credentials WHERE issuerDID = ? AND status = "not found"', [issuerDID]
    );
    const [recent] = await pool.query(
      'SELECT issuerName, credentialType, issueDate FROM credentials WHERE issuerDID = ? ORDER BY issueDate DESC LIMIT 5',
      [issuerDID]
    );

    res.json({
      totalIssued: issued[0].total,
      totalRevoked: revoked[0].total,
      totalPending: pending[0].total,
      recentActivities: recent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



//issuer revoked page fetch info
app.get('/api/credentials/requestss/:email', async (req, res) => {
  const { email } = req.params;
  console.log('📩 Incoming request for credentials of:', email);  // Move this after the declaration

  try {
    const [issuer] = await pool.query('SELECT issuerDID FROM issuers WHERE adminEmail = ?', [email]);
    if (!issuer.length) return res.status(404).json({ error: 'Issuer not found' });

    const issuerDID = issuer[0].issuerDID;

    const [rows] = await pool.query(
      'SELECT * FROM credentials WHERE (status = ? OR status = ?) AND issuerDID = ? ORDER BY created_at DESC',
      ['active', 'revoked', issuerDID]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});
// issuer revoked page revoked
app.put('/api/credentials/:id/revoke', async (req, res) => {
  const { id } = req.params;
  const { adminEmail } = req.body;

  try {
    const [issuer] = await pool.query('SELECT issuerDID FROM issuers WHERE adminEmail = ?', [adminEmail]);
    if (!issuer.length) return res.status(404).json({ error: 'Issuer not found' });

    const issuerDID = issuer[0].issuerDID;

    // Fetch credential using id to get credentialID
    const [credentialRows] = await pool.query('SELECT * FROM credentials WHERE id = ? AND issuerDID = ?', [id, issuerDID]);
    if (!credentialRows.length) return res.status(403).json({ error: 'Unauthorized or credential not found' });

    const credentialID = credentialRows[0].credentialID;

    // Update all credentials for that credentialID
    await pool.query('UPDATE credentials SET status = ? WHERE credentialID = ?', ['revoked', credentialID]);

    res.json({ message: 'Credential revoked successfully' });
  } catch (err) {
    console.error('Error revoking credential:', err);
    res.status(500).json({ error: 'Failed to revoke credential' });
  }
});


const verificationStore = {}; 



app.post('/api/verification/store', (req, res) => {
  const { id, credential } = req.body;
  if (!id || !credential) {
    return res.status(400).json({ error: 'Missing id or credential' });
  }
  verificationStore[id] = credential;
  res.status(200).json({ message: 'Verification data stored successfully' });
});

app.get('/api/verification/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM credential_requests 
       WHERE credentialID = ? AND status = 'active' 
       ORDER BY id DESC LIMIT 1`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Active credential not found' });

    res.json({ id, credential: rows[0] });
  } catch (err) {
    console.error("Verification fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/verification/detail/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM credential_requests 
       WHERE credentialID = ? AND status = 'active' 
       ORDER BY id DESC LIMIT 1`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Active credential not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error("Verification detail fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --- GET account info ---
app.get('/api/user/:did', async (req, res) => {
  const { did } = req.params;
  try {
    const [rows] = await pool.query('SELECT did, username, fullName, email, dateOfBirth, nationality FROM users WHERE did = ?', [did]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// --- UPDATE profile info (excluding password) ---
app.post('/api/user/update', async (req, res) => {
  const { did, username, fullname, email, date_of_birth, nationality } = req.body;
  try {
    await pool.query(
      'UPDATE users SET username=?, fullName=?, email=?, dateOfBirth=?, nationality=? WHERE did=?',
      [username, fullname, email, date_of_birth, nationality, did]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- CHANGE PASSWORD ---
app.post('/api/user/password', async (req, res) => {
  const { did, oldPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE did = ?', [did]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Incorrect old password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE did = ?', [hashed, did]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// --- DELETE ACCOUNT ---
app.delete('/api/user/delete/:did', async (req, res) => {
  const { did } = req.params;
  try {
    await pool.query('DELETE FROM credential_requests WHERE subjectDID = ?', [did]);
    await pool.query('DELETE FROM user_settings WHERE did = ?', [did]);
    await pool.query('DELETE FROM users WHERE did = ?', [did]);
    res.json({ message: 'Account and all data deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});




const { ethers } = require("ethers");

require("dotenv").config({ path: "../blockchain/.env" });

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("❌ PRIVATE_KEY or CONTRACT_ADDRESS missing in .env");
}

const abiPath = path.join(__dirname, "../blockchain/artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json");
const { abi } = JSON.parse(fs.readFileSync(abiPath));

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);


async function revokeCredentialOnBlockchain(credentialID) {
  const tx = await contract.revokeCredential(credentialID);
  await tx.wait();
}

async function markCredentialAsOnChainRevoked(credentialID) {
  await pool.query(`UPDATE credentials SET onChainRevoked = TRUE WHERE credentialID = ?`, [credentialID]);
  await pool.query(`UPDATE credential_requests SET onChainRevoked = TRUE WHERE credentialID = ?`, [credentialID]);
}

async function getOnChainRevokedStatus(credentialID) {
  const [rows] = await pool.query(`SELECT onChainRevoked FROM credentials WHERE credentialID = ? LIMIT 1`, [credentialID]);
  return rows[0]?.onChainRevoked === 1;
}





setInterval(async () => {
  try {
    const [rows] = await pool.query(`
      SELECT credentialID FROM credential_requests
      WHERE status IN ('revoked', 'not found', 'processing') OR status IS NULL
      UNION
      SELECT credentialID FROM credentials
      WHERE status IN ('revoked', 'not found', 'processing') OR status IS NULL
    `);

    const credentialIDs = [...new Set(rows.map(r => r.credentialID))];
    if (credentialIDs.length === 0) return;

    console.log(`🕐 Running credential check | Found ${credentialIDs.length} pending credentialIDs`);

    for (const credentialID of credentialIDs) {
      console.log(`🔍 Checking credential ID: ${credentialID}`);

      const [issuerRows] = await pool.query(
        "SELECT * FROM credentials WHERE credentialID = ? AND submittedBy = 'issuer' ORDER BY id DESC LIMIT 1",
        [credentialID]
      );
      const [userRows] = await pool.query(
        "SELECT * FROM credential_requests WHERE credentialID = ? AND submittedBy = 'user' ORDER BY id DESC LIMIT 1",
        [credentialID]
      );
      
      const issuerData = issuerRows[0];
      const userData = userRows[0];
      
      const hasIssuer = !!issuerData;
      const hasUser = !!userData;
      
      const issuerStatus = issuerData?.status?.toLowerCase();
      const userStatus = userData?.status?.toLowerCase();
      
      console.log(`📥 Issuer submitted: ${hasIssuer}, Status: ${issuerStatus}`);
      console.log(`📥 User submitted: ${hasUser}, Status: ${userStatus}`);
      
      // 🛑 Revocation logic stays unchanged
      if (issuerStatus === 'revoked' || userStatus === 'revoked') {
        const onChainRevoked = await getOnChainRevokedStatus(credentialID);
        if (!onChainRevoked) {
          try {
            await revokeCredentialOnBlockchain(credentialID);
            await markCredentialAsOnChainRevoked(credentialID);
            console.log(`✅ Blockchain credential revoked: ${credentialID}`);
          } catch (error) {
            if (error.reason?.includes('already revoked')) {
              await markCredentialAsOnChainRevoked(credentialID);
              console.log(`⚠️ Credential ${credentialID} was already revoked on-chain`);
            } else {
              console.error(`❌ Failed to revoke credential:`, error);
            }
          }
        } else {
          console.log(`🔁 Skipping already-revoked credential: ${credentialID}`);
        }
      
        await pool.query("UPDATE credentials SET status = 'revoked' WHERE credentialID = ?", [credentialID]);
        await pool.query("UPDATE credential_requests SET status = 'revoked' WHERE credentialID = ?", [credentialID]);
        continue;
      }
      
      //  Allow reprocessing even if previous status was 'meta-data not match' or 'not found'
      let finalStatus = 'not found';
      
      if (hasIssuer && hasUser) {
        const fieldsToCheck = ['issuerID', 'issuerName', 'credentialType', 'issueDate', 'expiryDate'];
        const mismatchedFields = [];
      
        fieldsToCheck.forEach(field => {
          const issuerVal = issuerData[field]?.toString().trim().toLowerCase();
          const userVal = userData[field]?.toString().trim().toLowerCase();
          if (issuerVal !== userVal) {
            mismatchedFields.push(field);
          }
        });
      
        if (mismatchedFields.length === 0) {
          try {
            const isOnChain = await contract.isCredentialValid(credentialID);
            if (!isOnChain) {
              const tx = await contract.registerCredential(credentialID);
              await tx.wait();
              console.log(`✅ Registered on blockchain: ${credentialID}`);
              finalStatus = 'active';
            } else {
              console.warn(`⚠️ Already on blockchain. Duplicate.`);
              finalStatus = 'duplicate';
            }
          } catch (err) {
            console.error(`❌ Blockchain error: ${err.message}`);
            finalStatus = 'blockchain error';
          }
        } else {
          console.warn(`❌ Metadata mismatch: ${mismatchedFields.join(', ')}`);
          finalStatus = 'meta-data not match';
        }
      } else {
        console.warn(`⏳ Waiting for both issuer and user submission`);
        finalStatus = 'waiting for both issuer and user submission';
      }
      
      // Only update the *latest* issuer and user row by ID
      if (hasIssuer && issuerData.status !== 'active') {
        await pool.query(
          "UPDATE credentials SET status = ? WHERE id = ?",
          [finalStatus, issuerData.id]
        );
      }
      
      if (hasUser && userData.status !== 'active') {
        await pool.query(
          "UPDATE credential_requests SET status = ? WHERE id = ?",
          [finalStatus, userData.id]
        );
      }
      
      //  Promote both to 'active' explicitly if matched
      if (finalStatus === 'active') {
        if (hasIssuer) {
          await pool.query(
            "UPDATE credentials SET status = 'active' WHERE id = ?",
            [issuerData.id]
          );
        }
        if (hasUser) {
          await pool.query(
            "UPDATE credential_requests SET status = 'active' WHERE id = ?",
            [userData.id]
          );
        }
      }
    }
  } catch (err) {
    console.error("❌ Loop Error:", err);
  }
}, 3000); // Every 3 seconds

// ------------------- START SERVER -------------------
app.listen(port, () => {
    console.log(`DecentraID backend running on http://localhost:${port}`);
});


