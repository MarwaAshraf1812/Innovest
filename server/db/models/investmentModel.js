const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    proposal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
    investor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    amount_invested: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
