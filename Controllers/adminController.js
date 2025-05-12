const User = require('../models/User');
const Loan = require('../models/LoanApplication');

const getDashboardStats = async (req, res) => {
    try {
        // Get the count of users
        const totalUsers = await User.countDocuments();

        // Get the count of loans
        const totalLoans = await Loan.countDocuments();

        // Loan status-based counts
        const totalApprovedLoans = await Loan.countDocuments({ status: 'Verified' });
        const totalPendingLoans = await Loan.countDocuments({ status: 'Pending' });
        const totalRejectedLoans = await Loan.countDocuments({ status: 'Rejected' });

        // Sending the response
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLoans,
                totalApprovedLoans,
                totalPendingLoans,
                totalRejectedLoans
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find();
        res.status(200).json({
            success: true,
            data: loans
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllLoans
};
