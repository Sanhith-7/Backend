const { users, handleCors } = require('./_shared');

module.exports = (req, res) => {
    // Handle CORS preflight
    if (handleCors(req, res)) return;
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Store user (in-memory)
    users[email] = { password };
    
    res.json({ success: true, message: 'User registered successfully' });
};
