import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  page_number: { type: Number, required: true },
  duration_seconds: { type: Number, default: 0 },
  view_count: { type: Number, default: 1 }
}, { _id: false });

const vdrAnalyticsSchema = new mongoose.Schema({
  document_id: { type: String, required: true },
  project_id: { type: String, required: true, ref: 'Project' },
  viewer_id: { type: String, required: true, ref: 'User' },
  total_duration_seconds: { type: Number, default: 0 },
  page_views: [pageViewSchema],
  access_expires_at: { type: Date },
  is_revoked: { type: Boolean, default: false },
  watermark_enabled: { type: Boolean, default: true },
  last_viewed_at: { type: Date, default: Date.now }
}, { timestamps: true });

vdrAnalyticsSchema.index({ project_id: 1, viewer_id: 1 });
vdrAnalyticsSchema.index({ document_id: 1, viewer_id: 1 });

const VDRAnalytics = mongoose.models.VDRAnalytics || mongoose.model('VDRAnalytics', vdrAnalyticsSchema);
export default VDRAnalytics;
