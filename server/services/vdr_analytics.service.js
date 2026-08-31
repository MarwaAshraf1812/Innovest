import VDRAnalytics from '../db/models/vdrAnalyticsModel.js';
import Project from '../db/models/projectModel.js';

class VDRAnalyticsService {
  /**
   * Log page view duration & heatmap metric for a pitch deck slide
   */
  async recordPageView({ projectId, documentId, viewerId, pageNumber, durationSeconds = 5 }) {
    let analytics = await VDRAnalytics.findOne({ document_id: documentId, viewer_id: viewerId });

    if (!analytics) {
      analytics = new VDRAnalytics({
        document_id: documentId,
        project_id: projectId,
        viewer_id: viewerId,
        page_views: []
      });
    }

    // Access control check
    if (analytics.is_revoked) {
      throw new Error('VDR_ACCESS_REVOKED: Access to this document has been revoked by the project owner.');
    }

    if (analytics.access_expires_at && new Date() > new Date(analytics.access_expires_at)) {
      throw new Error('VDR_ACCESS_EXPIRED: Link access duration for this document has expired.');
    }

    analytics.total_duration_seconds += durationSeconds;
    analytics.last_viewed_at = new Date();

    const pageIndex = analytics.page_views.findIndex((pv) => pv.page_number === pageNumber);
    if (pageIndex > -1) {
      analytics.page_views[pageIndex].duration_seconds += durationSeconds;
      analytics.page_views[pageIndex].view_count += 1;
    } else {
      analytics.page_views.push({
        page_number: pageNumber,
        duration_seconds: durationSeconds,
        view_count: 1
      });
    }

    await analytics.save();
    return analytics;
  }

  /**
   * Get deck heatmap analytics for a specific document
   */
  async getDocumentAnalytics(documentId, requesterId) {
    const records = await VDRAnalytics.find({ document_id: documentId }).lean();
    
    // Aggregation logic
    let totalViews = records.length;
    let grandTotalDuration = 0;
    const pageHeatmap = {};

    records.forEach((rec) => {
      grandTotalDuration += rec.total_duration_seconds || 0;
      (rec.page_views || []).forEach((pv) => {
        if (!pageHeatmap[pv.page_number]) {
          pageHeatmap[pv.page_number] = { page_number: pv.page_number, total_duration: 0, total_views: 0 };
        }
        pageHeatmap[pv.page_number].total_duration += pv.duration_seconds || 0;
        pageHeatmap[pv.page_number].total_views += pv.view_count || 0;
      });
    });

    const heatmapArray = Object.values(pageHeatmap).sort((a, b) => a.page_number - b.page_number);

    return {
      document_id: documentId,
      total_viewers: totalViews,
      total_duration_seconds: grandTotalDuration,
      heatmap: heatmapArray,
      viewer_details: records
    };
  }

  /**
   * Set or update VDR access restrictions for an investor
   */
  async updateAccessControl(projectId, { documentId, viewerId, isRevoked, expiresAt, watermarkEnabled }) {
    let analytics = await VDRAnalytics.findOne({ document_id: documentId, viewer_id: viewerId });

    if (!analytics) {
      analytics = new VDRAnalytics({
        document_id: documentId,
        project_id: projectId,
        viewer_id: viewerId,
        page_views: []
      });
    }

    if (typeof isRevoked === 'boolean') analytics.is_revoked = isRevoked;
    if (expiresAt !== undefined) analytics.access_expires_at = expiresAt ? new Date(expiresAt) : null;
    if (typeof watermarkEnabled === 'boolean') analytics.watermark_enabled = watermarkEnabled;

    await analytics.save();
    return analytics;
  }
}

export default new VDRAnalyticsService();
