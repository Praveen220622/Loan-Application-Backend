const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getMe,
    verifyToken
} = require('../Controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);

module.exports = router;
