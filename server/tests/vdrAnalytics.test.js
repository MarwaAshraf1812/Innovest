import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import vdrWatermarkService from '../services/vdr_watermark.service.js';
import vdrAnalyticsService from '../services/vdr_analytics.service.js';
import VDRAnalytics from '../db/models/vdrAnalyticsModel.js';
import Project from '../db/models/projectModel.js';
import { PDFDocument, StandardFonts } from 'pdf-lib';

describe('Phase 2: Virtual Data Room (VDR) & Pitch Deck Analytics Tests', () => {
  let mongoServer;
  const testProjectId = 'test-proj-123';
  const testDocId = 'pitch_deck_sample.pdf';
  const testViewerId = 'investor-user-456';
  const testOwnerId = 'founder-user-789';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    await Project.create({
      project_id: testProjectId,
      project_name: 'VDR Test Project',
      description: 'Testing VDR Security',
      entrepreneur_id: testOwnerId,
      field: 'Fintech',
      budget: 100000,
      deadline: '2026-12-31'
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await VDRAnalytics.deleteMany({});
  });

  describe('1. Dynamic PDF Watermarking Engine', () => {
    it('should stitch dynamic security watermark onto a PDF buffer', async () => {
      // Create a minimal 1-page PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText('Sample Pitch Deck Content', { x: 50, y: 300, font, size: 18 });
      const rawPdfBytes = await pdfDoc.save();
      const rawBuffer = Buffer.from(rawPdfBytes);

      const watermarkedBuffer = await vdrWatermarkService.watermarkPDF(rawBuffer, {
        viewerEmail: 'sarah.investor@vc.com',
        ipAddress: '192.168.1.42',
        timestamp: new Date()
      });

      expect(watermarkedBuffer).toBeInstanceOf(Buffer);
      expect(watermarkedBuffer.length).toBeGreaterThan(rawBuffer.length);

      // Verify watermarked PDF can be loaded back
      const loadedDoc = await PDFDocument.load(watermarkedBuffer);
      expect(loadedDoc.getPageCount()).toBe(1);
    });
  });

  describe('2. Slide-by-Slide Heatmap Analytics', () => {
    it('should aggregate viewing duration and view count per page', async () => {
      // 1st view: Page 1 for 10 seconds
      await vdrAnalyticsService.recordPageView({
        projectId: testProjectId,
        documentId: testDocId,
        viewerId: testViewerId,
        pageNumber: 1,
        durationSeconds: 10
      });

      // 2nd view: Page 2 for 30 seconds
      await vdrAnalyticsService.recordPageView({
        projectId: testProjectId,
        documentId: testDocId,
        viewerId: testViewerId,
        pageNumber: 2,
        durationSeconds: 30
      });

      // 3rd view: Page 1 for 15 seconds (return view)
      await vdrAnalyticsService.recordPageView({
        projectId: testProjectId,
        documentId: testDocId,
        viewerId: testViewerId,
        pageNumber: 1,
        durationSeconds: 15
      });

      const analytics = await vdrAnalyticsService.getDocumentAnalytics(testDocId, testOwnerId);

      expect(analytics.document_id).toBe(testDocId);
      expect(analytics.total_viewers).toBe(1);
      expect(analytics.total_duration_seconds).toBe(55);

      const heatmap = analytics.heatmap;
      expect(heatmap).toHaveLength(2);

      // Page 1 assertions
      const page1 = heatmap.find((p) => p.page_number === 1);
      expect(page1.total_duration).toBe(25);
      expect(page1.total_views).toBe(2);

      // Page 2 assertions
      const page2 = heatmap.find((p) => p.page_number === 2);
      expect(page2.total_duration).toBe(30);
      expect(page2.total_views).toBe(1);
    });
  });

  describe('3. VDR Access Revocation & Expiration Controls', () => {
    it('should block access when investor access is revoked by founder', async () => {
      // Revoke access
      await vdrAnalyticsService.updateAccessControl(testProjectId, {
        documentId: testDocId,
        viewerId: testViewerId,
        isRevoked: true
      });

      await expect(
        vdrAnalyticsService.recordPageView({
          projectId: testProjectId,
          documentId: testDocId,
          viewerId: testViewerId,
          pageNumber: 1,
          durationSeconds: 5
        })
      ).rejects.toThrow('VDR_ACCESS_REVOKED');
    });

    it('should block access when link expiration date has passed', async () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      await vdrAnalyticsService.updateAccessControl(testProjectId, {
        documentId: testDocId,
        viewerId: testViewerId,
        expiresAt: pastDate
      });

      await expect(
        vdrAnalyticsService.recordPageView({
          projectId: testProjectId,
          documentId: testDocId,
          viewerId: testViewerId,
          pageNumber: 1,
          durationSeconds: 5
        })
      ).rejects.toThrow('VDR_ACCESS_EXPIRED');
    });
  });
});
