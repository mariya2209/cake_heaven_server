// backend/controllers/adminAuthController.js
const jwt = require('jsonwebtoken');

// Admin Login (using hardcoded credentials)
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    // Check if the provided credentials match the hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
        // Generate JWT token for the admin
        const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token will expire in 1 hour
        });

        // Respond with the token and user information
        return res.status(200).json({
            token,
            user: {
                id: 'admin',
                role: 'admin',
            },
        });
    } else {
        // If credentials are incorrect, send an error response
        return res.status(401).json({ msg: 'Invalid admin credentials' });
    }
};
