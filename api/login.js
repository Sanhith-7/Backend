const { users, handleCors } = require('./_shared');

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

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            error: 'Email and password are required' 
        });
    }
    
    const user = users[email];
    if (!user || user.password !== password) {
        return res.status(401).json({ 
            success: false,
            error: 'Invalid email or password' 
        });
    }
    
    res.json({ 
        success: true, 
        message: 'Login successful' 
    });
};
