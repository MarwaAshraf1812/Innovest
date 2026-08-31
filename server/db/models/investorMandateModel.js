import mongoose from 'mongoose';

const investorMandateSchema = new mongoose.Schema({
  investor_id: { type: String, required: true, ref: 'User', unique: true },
  preferred_sectors: [{ type: String, trim: true }],
  preferred_stages: [{ type: String, trim: true }],
  min_check_size: { type: Number, default: 10000 },
  max_check_size: { type: Number, default: 1000000 },
  target_countries: [{ type: String, trim: true }],
  investment_thesis: { type: String, default: '' },
  feature_vector: [{ type: Number }]
}, { timestamps: true });

investorMandateSchema.index({ investor_id: 1 });

const InvestorMandate = mongoose.models.InvestorMandate || mongoose.model('InvestorMandate', investorMandateSchema);
export default InvestorMandate;
