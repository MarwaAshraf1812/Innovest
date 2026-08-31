import vdrWatermarkService from '../services/vdr_watermark.service.js';
import vdrAnalyticsService from '../services/vdr_analytics.service.js';
import Project from '../db/models/projectModel.js';
import VDRAnalytics from '../db/models/vdrAnalyticsModel.js';
import path from 'path';
import fs from 'fs/promises';

class VDRController {
  /**
   * Serve watermarked pitch deck document
   */
  async streamWatermarkedDocument(req, res) {
    try {
      const { filename } = req.params;
      const user = req.user;
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      const filePath = path.join(process.cwd(), 'uploads', filename);

      try {
        await fs.access(filePath);
      } catch (err) {
        return res.status(404).json({ error: 'File not found on server.' });
      }

      // Check VDR access revocation/expiration if analytics record exists
      const existingAccess = await VDRAnalytics.findOne({ document_id: filename, viewer_id: user.id });
      if (existingAccess) {
        if (existingAccess.is_revoked) {
          return res.status(403).json({ error: 'VDR Access Revoked: Access to this document has been revoked.' });
        }
        if (existingAccess.access_expires_at && new Date() > new Date(existingAccess.access_expires_at)) {
          return res.status(403).json({ error: 'VDR Access Expired: The link access duration for this document has expired.' });
        }
      }

      // Watermark if file is PDF
      if (filename.toLowerCase().endsWith('.pdf')) {
        const watermarkedBuffer = await vdrWatermarkService.watermarkPDF(filePath, {
          viewerEmail: user.email || user.username || 'Investor',
          ipAddress: ipAddress,
          timestamp: new Date()
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="watermarked_${filename}"`);
        return res.send(watermarkedBuffer);
      }

      // Fallback for non-pdf files
      return res.sendFile(filePath);
    } catch (error) {
      console.error('VDR Stream Error:', error);
      return res.status(500).json({ error: 'Failed to process VDR document stream.' });
    }
  }

  /**
   * Log slide viewing heartbeat metric
   */
  async logSlideMetric(req, res) {
    try {
      const { project_id, document_id, page_number, duration_seconds } = req.body;
      const viewerId = req.user.id;

      if (!project_id || !document_id || page_number === undefined) {
        return res.status(400).json({ error: 'Missing required parameters: project_id, document_id, page_number' });
      }

      const analytics = await vdrAnalyticsService.recordPageView({
        projectId: project_id,
        documentId: document_id,
        viewerId: viewerId,
        pageNumber: Number(page_number),
        durationSeconds: Number(duration_seconds) || 5
      });

      return res.status(200).json({ message: 'Slide view metric recorded', analytics });
    } catch (error) {
      if (error.message.startsWith('VDR_ACCESS')) {
        return res.status(403).json({ error: error.message });
      }
      console.error('VDR Heartbeat Log Error:', error);
      return res.status(500).json({ error: 'Failed to record slide view metric.' });
    }
  }

  /**
   * Fetch slide heatmap analytics for document
   */
  async getDeckAnalytics(req, res) {
    try {
      const { document_id } = req.params;
      const analytics = await vdrAnalyticsService.getDocumentAnalytics(document_id, req.user.id);
      return res.status(200).json(analytics);
    } catch (error) {
      console.error('VDR Get Analytics Error:', error);
      return res.status(500).json({ error: 'Failed to retrieve VDR analytics.' });
    }
  }

  /**
   * Revoke or grant VDR access for investor
   */
  async updateAccessControl(req, res) {
    try {
      const { project_id, document_id, viewer_id, is_revoked, expires_at, watermark_enabled } = req.body;

      const project = await Project.findOne({ project_id });
      if (!project) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      if (project.entrepreneur_id !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Only project owners can modify VDR access control.' });
      }

      const updated = await vdrAnalyticsService.updateAccessControl(project_id, {
        documentId: document_id,
        viewerId: viewer_id,
        isRevoked: is_revoked,
        expiresAt: expires_at,
        watermarkEnabled: watermark_enabled
      });

      return res.status(200).json({ message: 'VDR access permissions updated successfully', updated });
    } catch (error) {
      console.error('VDR Access Control Update Error:', error);
      return res.status(500).json({ error: 'Failed to update access control.' });
    }
  }
}

export default new VDRController();
