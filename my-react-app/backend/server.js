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

// Connect to IPFS (Infura public gateway)
const ipfs = create({ url: 'https://ipfs.io' });

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
    const { credentialID, credentialType, description, requestedDate, expiryDate, issuerName, issuerDID } = req.body;
    const subjectDID = req.user.did; // ✅ Logged-in user's DID from JWT
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      'INSERT INTO credential_requests (subjectDID, issuerDID, credentialID, credentialType, description, requestedDate, expiryDate, filePath, issuerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [subjectDID, issuerDID, credentialID, credentialType, description, requestedDate, expiryDate, filePath, issuerName]
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
  const { did } = req.params; // Get the DID from the route parameter
  try {
    const [rows] = await pool.query(
      'SELECT * FROM credential_requests WHERE subjectDID = ? AND status = ? ORDER BY created_at DESC',
      [did, 'not found']  // Filter by the logged-in user's DID and the not found status
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch rejected credentials' });
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
  


  // app.get('/api/credentials/request/:subjectDID', async (req, res) => {
  //   try {
  //     const { subjectDID } = req.params;
  //     const [rows] = await pool.query(
  //       'SELECT * FROM credential_requests WHERE subjectDID = ? ORDER BY created_at DESC LIMIT 1',
  //       [subjectDID]
  //     );
  //     if (rows.length === 0) return res.status(404).json({ error: 'No request found for this DID' });
  //     res.json(rows[0]);
  //   } catch (err) {
  //     console.error('DID fetch error:', err);
  //     res.status(500).json({ error: 'Server error' });
  //   }
  // });



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
        request.requestedDate,
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
      requestedDate,
      expiryDate,
      reason,
      filePath,
      issuerDID
    } = req.body;

    // Insert request into credential_requests
    await db.query(
      `INSERT INTO credential_requests 
       (credentialType, issuerName, subjectDID, requestedDate, expiryDate, reason, filePath, issuerDID) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [credentialType, issuerName, subjectDID, requestedDate, expiryDate, reason, filePath, issuerDID]
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
      title, type, subjectDID, issuerDID, issueDate, expirationDate,
      credentialId, status, cryptoProof, issuerName, subjectName,
      description, metadata, tags, schemaUrl,
    } = req.body;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO credentials 
      (credentialTitle, credentialType, subjectDID, issuerDID, issueDate, expirationDate,
       credentialID, status, cryptoProof, issuerName, subjectName, description, metadata, tags, schemaUrl, filePath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        type,
        subjectDID,
        issuerDID,
        issueDate,
        expirationDate || null,
        credentialId, // This is the JS variable; it maps to SQL column credentialID
        status || "not found",
        cryptoProof || null,
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
    // Find issuerDID from adminEmail
    const [issuer] = await pool.query('SELECT issuerDID FROM issuers WHERE adminEmail = ?', [adminEmail]);
    if (!issuer.length) return res.status(404).json({ error: 'Issuer not found' });

    const issuerDID = issuer[0].issuerDID;

    // Verify the credential belongs to this issuer
    const [credential] = await pool.query('SELECT * FROM credentials WHERE id = ? AND issuerDID = ?', [id, issuerDID]);
    if (!credential.length) return res.status(403).json({ error: 'Unauthorized or credential not found' });

    // Revoke the credential
    await pool.query('UPDATE credentials SET status = ? WHERE id = ?', ['revoked', id]);

    res.json({ message: 'Credential revoked successfully' });
  } catch (err) {
    console.error('Error revoking credential:', err);
    res.status(500).json({ error: 'Failed to revoke credential' });
  }
});



const verificationStore = {}; // In-memory store, replace with DB in production

// Store verification data (POST)
app.post('/api/verification/store', (req, res) => {
  const { id, credential } = req.body;
  if (!id || !credential) {
    return res.status(400).json({ error: 'Missing id or credential' });
  }
  verificationStore[id] = credential;
  res.status(200).json({ message: 'Verification data stored successfully' });
});

// Fetch verification data by ID (GET)
app.get('/api/verification/:id', (req, res) => {
  const id = req.params.id;
  const credential = verificationStore[id];
  if (!credential) {
    return res.status(404).json({ error: 'Verification data not found or expired' });
  }
  res.status(200).json({ id, credential });
});








//setting


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



setInterval(async () => {
  try {
    const [requests] = await pool.query(
      "SELECT id, credentialID FROM credential_requests WHERE status IS NULL OR status = 'not found'"
    );

    if (requests.length === 0) return;

    console.log(`🕐 Running credential check | Found ${requests.length} pending requests`);

    const seen = new Set();

    for (const request of requests) {
      const { id, credentialID } = request;

      if (seen.has(credentialID)) continue;
      seen.add(credentialID);

      console.log(`🔍 Checking credential ID: ${credentialID}`);

      // Mark rows as 'processing' to prevent infinite loop
      await pool.query(
        "UPDATE credential_requests SET status = 'processing' WHERE credentialID = ? AND (status IS NULL OR status = 'not found')",
        [credentialID]
      );
      const [rowsUser] = await pool.query(
        "SELECT submittedBy FROM credential_requests WHERE credentialID = ?",
        [credentialID]
      );
      const [rowsIssuer] = await pool.query(
        "SELECT submittedBy FROM credentials WHERE credentialID = ?",
        [credentialID]
      );
      

      const submittedByUser = rowsUser.map(r => r.submittedBy);
      const submittedByIssuer = rowsIssuer.map(r => r.submittedBy);
      const hasIssuer = submittedByIssuer.includes('issuer');
      const hasUser = submittedByUser.includes('user');
      console.log(`📥 Submitted by issuer:`, hasIssuer);
      console.log(`📥 Submitted by user:`, hasUser);


      // Check blockchain status
      const isOnChain = await contract.isCredentialValid(credentialID);
      console.log(`🧾 Blockchain status: ${isOnChain}`);

      let finalStatus = 'not found';

      if (isOnChain) {
        console.warn(`❌ Already on blockchain: ${credentialID}`);
        finalStatus = 'duplicate';
      } else if (hasIssuer && hasUser) {
        try {
          const tx = await contract.registerCredential(credentialID);
          await tx.wait();
          console.log(`✅ Registered on blockchain: ${credentialID}`);
          finalStatus = 'active';
        } catch (err) {
          console.error(`❌ Blockchain error:`, err.message);
          finalStatus = 'blockchain error';
        }
      } else {
        console.warn(`⚠️ Waiting for both issuer and user submission: ${credentialID}`);
      }

      // Only update credential_request rows that are still processing
      await pool.query(
        "UPDATE credential_requests SET status = ? WHERE credentialID = ? AND status = 'processing'",
        [finalStatus, credentialID]
      );

      await pool.query(
        "UPDATE credentials SET status = ? WHERE credentialID = ?",
        [finalStatus, credentialID]
      );
    }
  } catch (err) {
    console.error("❌ Loop Error:", err);
  }
}, 1000);



// setInterval(async () => {
//   try {
//     const [requests] = await pool.query(
//       "SELECT id, credentialID FROM credential_requests WHERE status IS NULL OR status = 'not found'"
//     );

//     if (requests.length === 0) return;

//     console.log(`🕐 Running credential check | Found ${requests.length} pending requests`);

//     const seen = new Set();

//     for (const request of requests) {
//       const { id, credentialID } = request;

//       if (seen.has(credentialID)) continue;
//       seen.add(credentialID);

//       console.log(`🔍 Checking credential ID: ${credentialID}`);

//       // Mark all rows with this ID as "processing"
//       await pool.query(
//         "UPDATE credential_requests SET status = 'processing' WHERE credentialID = ? AND (status IS NULL OR status = 'not found')",
//         [credentialID]
//       );

//       const [match] = await pool.query(
//         "SELECT * FROM credentials WHERE credentialID = ?",
//         [credentialID]
//       );

//       console.log(`📦 Matches in credentials table: ${match.length}`);

//       // If credential is already active on blockchain, skip processing
//       const isOnChain = await contract.isCredentialValid(credentialID);
//       console.log(`🧾 Blockchain status of ${credentialID}: ${isOnChain}`);

//       if (isOnChain) {
//         console.warn(`❌ Already on blockchain: ${credentialID}`);
//         await pool.query("UPDATE credential_requests SET status = 'duplicated' WHERE credentialID = ?", [credentialID]);
//         continue;
//       }

//       let finalStatus = 'not found';

//       // If only one match found in credentials table (ensure it's a valid match for both user and issuer)

//       try {
//         const tx = await contract.registerCredential(credentialID);
//         await tx.wait();
//         console.log(`✅ Saved to blockchain: ${credentialID}`);
//         finalStatus = 'active';
//       } catch (err) {
//         console.error(`❌ Blockchain error for ${credentialID}:`, err.message);
//         finalStatus = 'blockchain error';
//       }


//       // Update status in credential_requests table and credentials table
//       await pool.query(
//         "UPDATE credential_requests SET status = ? WHERE credentialID = ?",
//         [finalStatus, credentialID]
//       );

//       await pool.query(
//         "UPDATE credentials SET status = ? WHERE credentialID = ?",
//         [finalStatus, credentialID]
//       );
//     }
//   } catch (err) {
//     console.error("❌ Loop Error:", err);
//   }
// }, 1000);

// setInterval(async () => {
//   try {
//     const [requests] = await pool.query(
//       "SELECT id, credentialID FROM credential_requests WHERE status IS NULL OR status = 'not found'"
//     );

//     for (const request of requests) {
//       const [match] = await pool.query(
//         'SELECT credentialID FROM credentials WHERE credentialID = ?',
//         [request.credentialID]
//       );

//       let status = 'not found';

//       // Check if already registered on blockchain
//       const isOnChain = await contract.isCredentialValid(request.credentialID);
//       if (isOnChain) {
//         status = 'duplicate';
//         console.warn(`❌ Credential already on blockchain: ${request.credentialID}`);
//         await pool.query('UPDATE credential_requests SET status = ? WHERE id = ?', [status, request.id]);
//         continue; // skip the rest, as it's already on the blockchain
//       }

//       // If there's exactly 1 match in the credentials table, then it's safe to proceed
//       if (match.length === 1) {
//         // Both issuer and user have matched the same credential, we can save it to the blockchain
//         try {
//           const tx = await contract.registerCredential(request.credentialID);
//           await tx.wait();
//           console.log(`✅ Saved to blockchain: ${request.credentialID}`);
//           status = 'active';  // Set status to 'active' after blockchain registration
//         } catch (err) {
//           console.error(`❌ Blockchain error for ${request.credentialID}:`, err.message);
//           status = 'blockchain error';  // Set status as 'blockchain error' in case of failure
//         }
//       } else if (match.length > 1) {
//         // If more than one match is found, this is a duplicate
//         status = 'duplicate';
//         console.warn(`❌ Duplicate credential detected in DB: ${request.credentialID}`);
//       }

//       // Update status in both tables
//       await pool.query(
//         'UPDATE credential_requests SET status = ? WHERE id = ?',
//         [status, request.id]
//       );

//       await pool.query(
//         'UPDATE credentials SET status = ? WHERE credentialID = ?',
//         [status, request.credentialID]
//       );
//     }
//   } catch (err) {
//     console.error('Error during scheduled credential check:', err);
//   }
// }, 1000); // runs every 1 second




// ------------------- START SERVER -------------------
app.listen(port, () => {
    console.log(`DecentraID backend running on http://localhost:${port}`);
});


