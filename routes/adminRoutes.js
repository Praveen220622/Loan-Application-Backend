const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getAllLoans
} = require('../Controllers/adminController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorizeRoles('admin'), getDashboardStats);

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

router.get('/loans', protect, authorizeRoles('admin'), getAllLoans);

module.exports = router;
