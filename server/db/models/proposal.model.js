const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  project_id: { type: String, ref: 'Project', required: true },
  entrepreneur_id: { type: String, ref: 'User', required: true },
  amount: { type: Number, required: true },
  milestones: {
    type: [
      {
        description: { type: String, required: true },
        period: { type: Date, required: true },
        amount: { type: Number, required: true, min: 0 }
      }
    ],
    validate: {
      validator: function (value) {
        const totalMilestoneAmount = value.reduce((sum, milestone) => sum + milestone.amount, 0);
        return totalMilestoneAmount <= this.amount;
      },
      message: 'Total milestone amount cannot exceed the proposal amount.'
    }
  },  
  benefits: [
    { description: { type: String, required: true } }
  ],  
  terms: { type: String, required: false },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const proposalRecipientSchema = new mongoose.Schema({
  proposal_id: { type: String, ref: 'Proposal', required: true },
  investor_id: { type: String, ref: 'User', required: true },
  sent_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' }
});

proposalSchema.index({ entrepreneur_id: 1, status: 1 });
proposalRecipientSchema.index({ proposal_id: 1, investor_id: 1, status: 1 });

const Proposal = mongoose.model('Proposal', proposalSchema);
const ProposalRecipient = mongoose.model('ProposalRecipient', proposalRecipientSchema);

module.exports = {
  Proposal,
  ProposalRecipient
};