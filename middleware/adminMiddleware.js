const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Add this line for debugging

        // Check if the token is for the hardcoded admin
        if (decoded.id === 'admin' && decoded.role === 'admin') {
            req.user = { role: 'admin' };
            return next();
        }

        const user = await User.findById(decoded.id);
        console.log('User found:', user); // Add this line for debugging
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        console.error('Admin middleware error:', err);
        res.status(401).json({ msg: 'Token is not valid', error: err.message });
    }
};