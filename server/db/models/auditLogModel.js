const mongoose = require('mongoose');

/**
 * Audit Log Model
 * Maintains immutable history of critical financial, access, and administration events.
 */
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    index: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    index: true
  },
  role: {
    type: String,
    enum: ['admin', 'entrepreneur', 'investor', 'user', 'guest'],
    default: 'guest'
  },
  resourceType: {
    type: String,
    required: true,
    index: true
  },
  resourceId: {
    type: String,
    required: false
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
