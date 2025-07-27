const { users } = require('./_shared');

module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (!users[email] || users[email].password !== password) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ success: true });
};
