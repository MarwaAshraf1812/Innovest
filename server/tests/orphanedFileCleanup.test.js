import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs/promises';
import path from 'path';
import Project from '../db/models/projectModel.js';
import { User } from '../db/models/userModel.js';
import FileManagement from '../services/file_management.service.js';
import OrphanedFileCleanupService from '../services/orphaned_file_cleanup.service.js';

describe('Orphaned File Cleanup Worker Tests', () => {
  let mongoServer;
  let activeFilename;
  let orphanedFilename;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
    await User.deleteMany({});

    // Save active file
    const activeFileMock = { originalname: 'active_pitch.pdf', buffer: Buffer.from('Active File Content') };
    activeFilename = await FileManagement.save_file(activeFileMock);

    // Save orphaned file
    const orphanedFileMock = { originalname: 'orphaned_deck.pdf', buffer: Buffer.from('Orphaned File Content') };
    orphanedFilename = await FileManagement.save_file(orphanedFileMock);

    // Associate active file in DB
    await Project.create({
      project_name: 'Cleanup Test Project',
      description: 'Testing file cleanup worker',
      entrepreneur_id: 'OWNER_999',
      status: 'under review',
      field: 'Tech',
      budget: 50000,
      deadline: '2026-12-31',
      documents: [activeFilename]
    });
  });

  it('1. Correctly identifies active files vs orphaned files on disk', async () => {
    const activeExists = await FileManagement.check_if_file_exist(activeFilename);
    const orphanedExists = await FileManagement.check_if_file_exist(orphanedFilename);

    expect(activeExists).toBe(true);
    expect(orphanedExists).toBe(true);
  });

  it('2. Deletes unreferenced orphaned files older than minAgeMs while preserving active files', async () => {
    // Run cleanup with minAgeMs = 0 to trigger immediate cleanup of unreferenced test files
    const result = await OrphanedFileCleanupService.cleanupOrphanedFiles({ minAgeMs: 0 });

    expect(result.deletedFilesCount).toBeGreaterThanOrEqual(1);
    expect(result.deletedFiles).toContain(orphanedFilename);
    expect(result.deletedFiles).not.toContain(activeFilename);

    const activeStillExists = await FileManagement.check_if_file_exist(activeFilename);
    const orphanedStillExists = await FileManagement.check_if_file_exist(orphanedFilename);

    expect(activeStillExists).toBe(true);
    expect(orphanedStillExists).toBe(false);
  });
});
