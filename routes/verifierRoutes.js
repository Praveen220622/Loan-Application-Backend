const express = require('express');
const router = express.Router();

const {
    getAllLoanApplications,
    verifyLoanApplication,
    getMyVerifiedLoans
} = require('../Controllers/verifierController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/loans', protect, authorizeRoles('verifier'), getAllLoanApplications);

router.put('/loans/verify/:id', protect, authorizeRoles('verifier'), verifyLoanApplication);

router.get('/my-loans', protect, authorizeRoles('verifier'), getMyVerifiedLoans);

module.exports = router;
