const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const proposalHistorySchema = new Schema({
  terms: {
    amount: { type: Number, required: true },
    equity_offered: { type: Number, required: true },
    conditions: { type: String, default: '' }
  },
  proposed_by: {
    type: String,
    enum: ['investor', 'entrepreneur'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  action: {
    type: String,
    enum: ['offer', 'counter', 'accept', 'reject', 'withdraw'],
    required: true
  }
}, { _id: false });

const proposalSchema = new Schema({
  proposal_id: { type: String, default: uuidv4, unique: true },
  project_id: { type: String, required: true },
  investor_id: { type: String, required: true },
  entrepreneur_id: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'countered', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
    required: true
  },
  last_action_by: {
    type: String,
    enum: ['investor', 'entrepreneur'],
    required: true
  },
  current_terms: {
    amount: { type: Number, required: true },
    equity_offered: { type: Number, required: true },
    conditions: { type: String, default: '' }
  },
  history: [proposalHistorySchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

proposalSchema.index({ project_id: 1, investor_id: 1 });

const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;
