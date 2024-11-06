const { check, validationResult } = require('express-validator');

const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateLogin;
