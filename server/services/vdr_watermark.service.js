import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

class VDRWatermarkService {
  /**
   * Stitches a dynamic security watermark onto a PDF buffer or file.
   * @param {Buffer|string} pdfSource - PDF file path or Buffer
   * @param {Object} metadata - { viewerEmail, ipAddress, timestamp }
   * @returns {Promise<Buffer>} Watermarked PDF buffer
   */
  async watermarkPDF(pdfSource, { viewerEmail = 'Anonymous', ipAddress = '0.0.0.0', timestamp = new Date() }) {
    let pdfBytes;
    if (typeof pdfSource === 'string') {
      pdfBytes = await fs.readFile(pdfSource);
    } else if (Buffer.isBuffer(pdfSource)) {
      pdfBytes = pdfSource;
    } else {
      throw new Error('Invalid PDF source. Expected buffer or file path.');
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const formattedDate = new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19);
    const watermarkText = `CONFIDENTIAL - INNOVEST VDR | ${viewerEmail} | IP: ${ipAddress} | ${formattedDate}`;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = Math.max(10, Math.min(width, height) / 35);
      
      // Draw primary diagonal watermark in center
      page.drawText(watermarkText, {
        x: width / 10,
        y: height / 2,
        size: fontSize,
        font: font,
        color: rgb(0.7, 0.2, 0.2), // Subtle warning maroon
        opacity: 0.35,
        rotate: degrees(35)
      });

      // Draw top header banner text
      page.drawText(`VDR TRACKED: ${viewerEmail}`, {
        x: 20,
        y: height - 20,
        size: 8,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.6
      });
    }

    const watermarkedPdfBytes = await pdfDoc.save();
    return Buffer.from(watermarkedPdfBytes);
  }
}

export default new VDRWatermarkService();
