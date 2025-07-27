const { otps, transporter, users, handleCors } = require('./_shared');

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = async (req, res) => {
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

    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false,
            error: 'Email is required' 
        });
    }

    // Check if user exists
    if (!users[email]) {
        return res.status(404).json({ 
            success: false,
            error: 'User not found' 
        });
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    
    // Store OTP
    otps[email] = {
        otp,
        expires,
        verified: false
    };

    try {
        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
        });

        res.json({ 
            success: true, 
            message: 'OTP sent successfully' 
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to send OTP' 
        });
    }
};
