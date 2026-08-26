const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ProjectController = require('../controllers/project.controller');
const Project = require('../db/models/projectModel');
const Proposal = require('../db/models/proposalModel');
const Investment = require('../db/models/investmentModel');
const { User } = require('../db/models/userModel');
const FileManagement = require('../services/file_management.service');
const fs = require('fs').promises;
const path = require('path');

describe('Project Document Security & Handling Tests', () => {
  let mongoServer;
  const ownerId = 'ENTREPRENEUR_OWNER_100';
  const unauthorizedInvestorId = 'INVESTOR_UNAUTH_200';
  const authorizedInvestorId = 'INVESTOR_AUTH_300';
  const adminId = 'ADMIN_400';

  let testProject;
  let sampleFilename;

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
    await Proposal.deleteMany({});
    await Investment.deleteMany({});
    await User.deleteMany({});

    // Save a physical sample file to uploads folder for download testing
    const sampleBuffer = Buffer.from('Pitch Deck Sample Content for Innovest Test');
    const mockFile = {
      originalname: 'sample_pitch_deck.pdf',
      buffer: sampleBuffer
    };
    sampleFilename = await FileManagement.save_file(mockFile);

    // Create Test Project owned by ownerId
    testProject = await Project.create({
      project_name: 'Document Test Pitch',
      description: 'Testing protected pitch deck access control',
      entrepreneur_id: ownerId,
      status: 'under review',
      field: 'Fintech',
      budget: 100000,
      deadline: '2026-12-31',
      documents: [sampleFilename]
    });

    // Create Authorized Investor user and active Proposal
    const authInvestorUser = await User.create({
      id: authorizedInvestorId,
      first_name: 'Auth',
      last_name: 'Investor',
      username: 'auth_investor',
      email: 'auth_inv@test.com',
      password: 'password123',
      role: 'INVESTOR'
    });

    await Proposal.create({
      project_id: testProject.project_id,
      investor_id: authorizedInvestorId,
      entrepreneur_id: ownerId,
      status: 'pending',
      last_action_by: 'investor',
      current_terms: { amount: 50000, equity_offered: 10 }
    });
  });

  function mockReqRes(user, body = {}, params = {}, query = {}, files = []) {
    let responseData;
    let statusCode;
    let sentFile;

    const req = { user, body, params, query, files };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
          sendFile: (filePath) => {
            statusCode = code || 200;
            sentFile = filePath;
          }
        };
      },
      sendFile: (filePath) => {
        statusCode = 200;
        sentFile = filePath;
      }
    };
    return {
      req,
      res,
      getStatus: () => statusCode,
      getData: () => responseData,
      getSentFile: () => sentFile
    };
  }

  it('1. Relative Path Storage: Project model stores filename only, not absolute paths', async () => {
    expect(sampleFilename).not.toContain('/media/dell/');
    expect(sampleFilename).not.toContain('\\');
    expect(sampleFilename).toMatch(/^sample_pitch_deck-\d+-\d+\.pdf$/);
  });

  it('2. GET Project Access Control: Hides document array for unauthorized users, shows for owner/authorized investor/admin', async () => {
    // Unauthorized Investor GET -> documents omitted, has_documents: true
    const unauthReq = mockReqRes(
      { id: unauthorizedInvestorId, role: 'INVESTOR' },
      {},
      { project_id: testProject.project_id }
    );
    await ProjectController.getProject(unauthReq.req, unauthReq.res);
    expect(unauthReq.getStatus()).toBe(200);
    const unauthData = unauthReq.getData();
    expect(unauthData.documents).toBeUndefined();
    expect(unauthData.has_documents).toBe(true);

    // Project Owner GET -> documents included
    const ownerReq = mockReqRes(
      { id: ownerId, role: 'ENTREPRENEUR' },
      {},
      { project_id: testProject.project_id }
    );
    await ProjectController.getProject(ownerReq.req, ownerReq.res);
    expect(ownerReq.getStatus()).toBe(200);
    const ownerData = ownerReq.getData();
    expect(ownerData.documents).toBeDefined();
    expect(ownerData.documents).toContain(sampleFilename);

    // Authorized Investor GET -> documents included
    const authReq = mockReqRes(
      { id: authorizedInvestorId, role: 'INVESTOR' },
      {},
      { project_id: testProject.project_id }
    );
    await ProjectController.getProject(authReq.req, authReq.res);
    expect(authReq.getStatus()).toBe(200);
    const authData = authReq.getData();
    expect(authData.documents).toBeDefined();
    expect(authData.documents).toContain(sampleFilename);

    // Admin GET -> documents included
    const adminReq = mockReqRes(
      { id: adminId, role: 'ADMIN' },
      {},
      { project_id: testProject.project_id }
    );
    await ProjectController.getProject(adminReq.req, adminReq.res);
    expect(adminReq.getStatus()).toBe(200);
    const adminData = adminReq.getData();
    expect(adminData.documents).toBeDefined();
    expect(adminData.documents).toContain(sampleFilename);
  });

  it('3. Protected Download Endpoint: Returns 403 for unauthorized users, 200/sendFile for authorized users', async () => {
    // Unauthorized Investor download attempt -> 403 Forbidden
    const unauthDL = mockReqRes(
      { id: unauthorizedInvestorId, role: 'INVESTOR' },
      {},
      { project_id: testProject.project_id, filename: sampleFilename }
    );
    await ProjectController.downloadProjectDocument(unauthDL.req, unauthDL.res);
    expect(unauthDL.getStatus()).toBe(403);
    expect(unauthDL.getData().message).toMatch(/Unauthorized access/i);

    // Authorized Investor download attempt -> 200 OK with sendFile
    const authDL = mockReqRes(
      { id: authorizedInvestorId, role: 'INVESTOR' },
      {},
      { project_id: testProject.project_id, filename: sampleFilename }
    );
    await ProjectController.downloadProjectDocument(authDL.req, authDL.res);
    expect(authDL.getStatus()).toBe(200);
    expect(authDL.getSentFile()).toBeDefined();
    expect(authDL.getSentFile()).toContain(sampleFilename);
  });

  it('4. Document Updates on Edit: PUT /api/project/:project_id updates pitch deck files', async () => {
    const newFileBuffer = Buffer.from('Updated Pitch Deck Content');
    const newMockFile = {
      originalname: 'updated_pitch_deck.pdf',
      buffer: newFileBuffer
    };

    const editReq = mockReqRes(
      { id: ownerId, role: 'ENTREPRENEUR' },
      { project_name: 'Updated Document Pitch', description: 'Updated desc', field: 'Fintech', budget: 120000, deadline: '2026-12-31' },
      { project_id: testProject.project_id },
      {},
      [newMockFile]
    );

    await ProjectController.updateProject(editReq.req, editReq.res);
    expect(editReq.getStatus()).toBe(200);
    const updatedData = editReq.getData();
    expect(updatedData.documents).toBeDefined();
    expect(updatedData.documents[0]).toMatch(/^updated_pitch_deck-\d+-\d+\.pdf$/);
  });
});
