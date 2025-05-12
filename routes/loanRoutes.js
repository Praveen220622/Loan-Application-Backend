const express = require('express');
const router = express.Router();
const {
    applyLoan,
    getMyLoans
} = require('../Controllers/loanController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');


router.post('/apply', protect, authorizeRoles('user'), applyLoan);
router.get('/my', protect, authorizeRoles('user'), getMyLoans);

module.exports = router;
