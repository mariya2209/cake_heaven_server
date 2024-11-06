const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

// Single middleware to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        req.user = user; // Attach user info to request object for later use
        next(); // Call next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Authorization failed' });
    }
};

module.exports = { verifyAdmin };





