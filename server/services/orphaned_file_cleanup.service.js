import fs from 'fs/promises';
import path from 'path';
import Project from '../db/models/projectModel.js';
import { User } from '../db/models/userModel.js';
import FileManagement from './file_management.service.js';

class OrphanedFileCleanupService {
    /**
     * Scans uploads folder and removes files not referenced in Project documents or User id_documents.
     * @param {Object} options
     * @param {number} options.minAgeMs - Minimum age in milliseconds before a file is considered orphaned (default: 5 minutes)
     * @returns {Promise<Object>} Cleanup result statistics
     */
    async cleanupOrphanedFiles({ minAgeMs = 5 * 60 * 1000 } = {}) {
        const uploadDir = FileManagement.default_upload_path;
        
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            const diskFiles = await fs.readdir(uploadDir);

            // Fetch active document filenames from MongoDB collections
            const projectDocsRaw = await Project.distinct('documents');
            const userDocsRaw = await User.distinct('id_documents');

            const activeFilenames = new Set();

            [...projectDocsRaw, ...userDocsRaw].forEach((docPath) => {
                if (docPath) {
                    const cleanName = path.basename(docPath);
                    activeFilenames.add(cleanName);
                }
            });

            const deletedFiles = [];
            const now = Date.now();

            for (const filename of diskFiles) {
                // Ignore system files
                if (filename === '.gitkeep' || filename.startsWith('.')) {
                    continue;
                }

                // If file is not in DB active references
                if (!activeFilenames.has(filename)) {
                    const fullPath = path.join(uploadDir, filename);
                    try {
                        const stats = await fs.stat(fullPath);
                        const fileAgeMs = now - stats.mtimeMs;

                        // Only delete files older than minAgeMs
                        if (fileAgeMs >= minAgeMs) {
                            await fs.unlink(fullPath);
                            deletedFiles.push(filename);
                        }
                    } catch (statErr) {
                        console.error(`Error statting/deleting orphaned file ${filename}:`, statErr.message);
                    }
                }
            }

            return {
                scannedFilesCount: diskFiles.length,
                activeFilesCount: activeFilenames.size,
                deletedFilesCount: deletedFiles.length,
                deletedFiles
            };
        } catch (error) {
            console.error('Error during orphaned file cleanup:', error.message);
            throw new Error('Orphaned file cleanup failed: ' + error.message);
        }
    }
}

export default new OrphanedFileCleanupService();
