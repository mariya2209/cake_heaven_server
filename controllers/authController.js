const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Signup route
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    console.log('Signup attempt:', { firstName, lastName, email, role });

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        console.log('Hashed password:', hashedPassword);

        // Create new user
        user = new User({ firstName, lastName, email, password: hashedPassword, role });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Successful Sign Up',
            text: `Congratulations! You have successfully signed up.\n\nUsername: ${user.email}\nPassword: The password you provided during signup\n\nPlease keep this information secure.`
        };

        await transporter.sendMail(message);

        // Send response with token
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Login route
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log('Stored hashed password:', user.password);
        const isMatch = await bcryptjs.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Step 1: Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Step 2: Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Hash the token and set it to the user object
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
        console.log(user.resetPasswordToken)
        // Save user with token and expiration
        await user.save();

        // Step 3: Create reset URL
        // Step 3: Create reset URL
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;


        // Step 4: Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email from .env
                pass: process.env.EMAIL_PASS, // Your email password (or app password) from .env
            },
        });

        const message = {
            from: process.env.EMAIL_USER, // Your email address as the "from" address
            to: user.email, // Send to user's email
            subject: 'Password Reset Request',
            text: `You have requested to reset your password. Please make a PUT request to: \n\n ${resetUrl}`,

        };

        await transporter.sendMail(message);

        res.status(200).json({ msg: 'Email sent. Please check your inbox for the reset link.' });
    } catch (err) {
        console.error(err);
        // In case of email failure, reset the token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({ msg: 'Email could not be sent' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    console.log(req.params)
    const resetToken = req.params.token;

    // Hash the token for comparison
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
console.log(hashedToken)
    try {
        // Find user with the hashed token and check if token is not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
         
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpire = undefined; // Clear the expiration date

        await user.save(); // Save the updated user

        res.status(200).json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
// Logout route
exports.logout = (req, res) => {
    res.status(200).json({ msg: 'Successfully logged out' });
};

// Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user with the given email
        const user = await User.findOne({ email });
        
        // Check if user exists and has admin role
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user: { id: user._id, role: user.role } });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
