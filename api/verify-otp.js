const { otps, users, handleCors } = require('./_shared');

module.exports = (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;
    
    if (req.method !== 'POST') {
        res.setHeader('Access-Control-Allow-Origin', 'https://angelic-life-970128.framer.website');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://angelic-life-970128.framer.website');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ 
            success: false,
            error: 'Email and OTP are required' 
        });
    }
    
    const storedOtp = otps[email];
    
    if (!storedOtp) {
        return res.status(400).json({ 
            success: false,
            error: 'No OTP found for this email' 
        });
    }
    
    if (storedOtp.otp !== otp) {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid OTP' 
        });
    }
    
    if (storedOtp.expires < Date.now()) {
        delete otps[email];
        return res.status(400).json({ 
            success: false,
            error: 'OTP has expired' 
        });
    }
    
    // Mark OTP as verified
    storedOtp.verified = true;
    
    res.json({ 
        success: true, 
        message: 'OTP verified successfully' 
    });
};
