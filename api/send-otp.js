const { otps, transporter, EMAIL_USER } = require('./_shared');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { email } = req.body;
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
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};
