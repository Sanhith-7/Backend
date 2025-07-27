const { otps } = require('./_shared');

module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
    const record = otps[email];
    if (!record) return res.status(400).json({ error: 'No OTP sent' });
    if (record.verified) return res.status(400).json({ error: 'OTP already used' });
    if (Date.now() > record.expires) return res.status(400).json({ error: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    record.verified = true;
    res.json({ success: true });
};
