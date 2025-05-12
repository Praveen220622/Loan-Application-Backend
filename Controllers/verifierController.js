const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');


const getAllLoanApplications = async (req, res) => {
    try {
        const loanApplications = await LoanApplication.find({ status: 'Pending' })
            .populate('applicant', 'fullname email')
            .populate('verifiedBy', 'fullname email');

        res.status(200).json(loanApplications);
    } catch (error) {
        console.error('Error fetching loan applications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify or reject a loan application
// @route   PUT /api/verifier/loans/verify/:id
// @access  Private (verifier)
const verifyLoanApplication = async (req, res) => {
    const { status } = req.body;

    // Validate the status input
    if (!['Verified', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid loan status. It should be either "Verified" or "Rejected".' });
    }

    try {
        // Find the loan application by ID
        const loanApplication = await LoanApplication.findById(req.params.id);

        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found.' });
        }

        // Only update if the status is still 'Pending'
        if (loanApplication.status !== 'Pending') {
            return res.status(400).json({ message: 'This loan has already been processed.' });
        }

        // Update the loan status and set the verifier
        loanApplication.status = status;
        loanApplication.verifiedBy = req.user.id;

        const updatedLoan = await loanApplication.save();

        res.status(200).json(updatedLoan);
    } catch (error) {
        console.error('Error verifying loan application:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all loans for a particular verifier (for audit purposes)
// @route   GET /api/verifier/my-loans
// @access  Private (verifier)
const getMyVerifiedLoans = async (req, res) => {
    try {
        // Fetch loans verified by this verifier
        const loans = await LoanApplication.find({ verifiedBy: req.user.id })
            .populate('applicant', 'fullname email')
            .populate('verifiedBy', 'fullname email');

        res.status(200).json(loans);
    } catch (error) {
        console.error('Error fetching verified loans:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllLoanApplications,
    verifyLoanApplication,
    getMyVerifiedLoans
};
