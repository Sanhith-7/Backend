const nodemailer = require('nodemailer');

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

module.exports = {
    users,
    otps,
    transporter,
    EMAIL_USER
};
