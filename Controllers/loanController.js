const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');

// @desc    Submit a new loan application
// @route   POST /api/loans/apply
// @access  Private (user)
const applyLoan = async (req, res) => {
    const {
        fullname,
        amountRequested,
        tenureMonths,
        employmentStatus,
        reason,
        employmentAddress
    } = req.body;

    try {
        const newLoan = new LoanApplication({
            applicant: req.user.id,
            fullname,
            amountRequested,
            tenureMonths,
            employmentStatus,
            reason,
            employmentAddress
        });

        const savedLoan = await newLoan.save();
        res.status(201).json(savedLoan);
    } catch (err) {
        console.error('Loan apply error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all loan applications (for verifier)
// @route   GET /api/loans/verifier
// @access  Private (verifier)
const getAllLoanApplicationsForVerifier = async (req, res) => {
    try {
        const loans = await LoanApplication.find()
            .populate('applicant', 'fullname email');

        res.status(200).json(loans);
    } catch (err) {
        console.error('Verifier fetch error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify or reject a loan application
// @route   PUT /api/loans/verify/:id
// @access  Private (verifier)
const updateLoanStatus = async (req, res) => {
    const { status } = req.body;

    if (!['Verified', 'Pending', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const loan = await LoanApplication.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.status = status;
        loan.verifiedBy = req.user.id;

        const updatedLoan = await loan.save();

        res.status(200).json(updatedLoan);
    } catch (err) {
        console.error('Verify loan error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's loan applications
// @route   GET /api/loans/my
// @access  Private (user)
const getMyLoans = async (req, res) => {
    try {
        const myLoans = await LoanApplication.find({ applicant: req.user.id });
        res.status(200).json(myLoans);
    } catch (err) {
        console.error('Fetch user loans error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    applyLoan,
    getAllLoanApplicationsForVerifier,
    updateLoanStatus,
    getMyLoans
};
