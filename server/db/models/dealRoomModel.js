import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const signatureSchema = new mongoose.Schema({
  signed_by: { type: String, required: true, ref: 'User' },
  role: { type: String, enum: ['FOUNDER', 'INVESTOR'], required: true },
  signed_at: { type: Date, default: Date.now },
  ip_address: { type: String, default: '127.0.0.1' }
}, { _id: false });

const auditTrailSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performed_by: { type: String, required: true, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const dealRoomSchema = new mongoose.Schema({
  deal_room_id: { type: String, default: uuidv4, unique: true },
  project_id: { type: String, required: true, ref: 'Project' },
  founder_id: { type: String, required: true, ref: 'User' },
  investor_id: { type: String, required: true, ref: 'User' },
  status: {
    type: String,
    enum: ['DRAFTING', 'TERM_SHEET_SENT', 'UNDER_DUE_DILIGENCE', 'SIGNED', 'CANCELLED'],
    default: 'DRAFTING'
  },
  term_sheet: {
    investment_type: {
      type: String,
      enum: ['SAFE_POST_MONEY', 'SAFE_PRE_MONEY', 'CONVERTIBLE_NOTE', 'PRICED_ROUND'],
      default: 'SAFE_POST_MONEY'
    },
    valuation_cap: { type: Number, default: 5000000 },
    discount_rate: { type: Number, default: 20 }, // 20%
    investment_amount: { type: Number, required: true },
    target_closing_date: { type: Date },
    special_terms: [{ type: String }],
    signatures: [signatureSchema]
  },
  audit_trail: [auditTrailSchema]
}, { timestamps: true });

dealRoomSchema.index({ project_id: 1, investor_id: 1 });
dealRoomSchema.index({ deal_room_id: 1 });

const DealRoom = mongoose.models.DealRoom || mongoose.model('DealRoom', dealRoomSchema);
export default DealRoom;
