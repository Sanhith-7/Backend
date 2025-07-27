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
    
    const user = users[email];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({ success: true, message: 'Login successful' });
};
