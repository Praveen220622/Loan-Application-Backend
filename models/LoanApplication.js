const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    amountRequested: {
        type: Number,
        required: true
    },
    tenureMonths: {
        type: Number,
        required: true
    },
    employmentStatus: {
        type: String,
        enum: ['Employed', 'Self-Employed', 'Unemployed', 'Student'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    employmentAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
