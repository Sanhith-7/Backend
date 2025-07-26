// Minimal Node.js/Express backend for authentication demo
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory user store (for demo only!)
const users = {};

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (users[email]) return res.status(400).json({ error: "User already exists" });
    users[email] = { password };
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (!users[email] || users[email].password !== password) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ success: true });
});

// --- OTP logic ---
const nodemailer = require('nodemailer');
const otps = {}; // { email: { otp, expires, verified } }

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    console.log("POST /send-otp", email);
    if (!email) return res.status(400).json({ error: 'Email required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { otp, expires: Date.now() + 10 * 60 * 1000, verified: false };
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        });
        res.json({ success: true });
    } catch (e) {
        console.error("Failed to send OTP for", email, e);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log("POST /verify-otp", email, otp);
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
    const entry = otps[email];
    if (!entry || entry.otp !== otp || entry.expires < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    entry.verified = true;
    res.json({ success: true });
});

// Reset password
app.post('/reset-password', (req, res) => {
    const { email, password } = req.body;
    console.log("POST /reset-password", email);
    if (!email || !password) return res.status(400).json({ error: 'Email and new password required' });
    const entry = otps[email];
    if (!entry || !entry.verified) return res.status(400).json({ error: 'OTP not verified' });
    if (!users[email]) return res.status(400).json({ error: 'User not found' });
    users[email].password = password;
    delete otps[email];
    res.json({ success: true });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Auth backend running on http://localhost:${PORT}`);
});
