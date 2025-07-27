const nodemailer = require('nodemailer');
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'https://angelic-life-970128.framer.website',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// In-memory user store (for demo only!)
const users = {};

// OTP store
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

// Helper function to handle CORS preflight
const handleCors = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
};

module.exports = {
    users,
    otps,
    transporter,
    EMAIL_USER,
    cors: cors(corsOptions),
    handleCors
};
