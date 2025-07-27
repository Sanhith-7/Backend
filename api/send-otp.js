const { otps, transporter, EMAIL_USER, handleCors } = require('./_shared');

module.exports = async (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    // Store OTP
    otps[email] = { otp, expires, verified: false };
    
    // Send email
    try {
        await transporter.sendMail({
            from: `"F1 Streetwear" <${EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
        });
        
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};
