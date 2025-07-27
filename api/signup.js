const { users } = require('./_shared');

module.exports = (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (users[email]) return res.status(400).json({ error: "User already exists" });
    users[email] = { password };
    res.json({ success: true });
};
