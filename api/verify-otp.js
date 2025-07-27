const { otps, handleCors } = require('./_shared');

module.exports = (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    const otpData = otps[email];
    
    if (!otpData) {
        return res.status(400).json({ error: 'No OTP found for this email' });
    }
    
    if (otpData.expires < Date.now()) {
        delete otps[email];
        return res.status(400).json({ error: 'OTP has expired' });
    }
    
    if (otpData.verified) {
        return res.status(400).json({ error: 'OTP already used' });
    }
    
    if (otpData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Mark OTP as verified
    otpData.verified = true;
    
    res.json({ 
        success: true, 
        message: 'OTP verified successfully' 
    });
};
