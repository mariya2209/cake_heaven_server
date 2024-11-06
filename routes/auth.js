const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateUser = require('../middleware/validateUser');
const validateLogin = require('../middleware/validateLogin');

router.post('/signup', validateUser, authController.signup);
router.post('/login/user', validateLogin, authController.userLogin);
router.post('/login/admin', authController.adminLogin);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;






