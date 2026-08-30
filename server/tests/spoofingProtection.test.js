import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ProjectController from '../controllers/project.controller.js';
import CommunityController from '../controllers/community.controller.js';
import MessageController from '../controllers/message.controller.js';
import Project from '../db/models/projectModel.js';
import Community from '../db/models/communityModel.js';
import Message from '../db/models/messagesModel.js';
import Admin from '../db/models/adminModel.js';

describe('Field Spoofing Protection Tests', () => {
  let mongoServer;

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
    await Community.deleteMany({});
    await Message.deleteMany({});
    await Admin.deleteMany({});
  });

  it('1. Project Create: ignores spoofed entrepreneur_id in req.body and uses req.user.id', async () => {
    const actualUserId = 'ACTUAL_USER_ID_123';
    const spoofedUserId = 'SPOOFED_USER_ID_999';

    const req = {
      user: { id: actualUserId, role: 'ENTREPRENEUR' },
      body: {
        project_name: 'Anti-Spoof Pitch',
        description: 'Testing if entrepreneur_id spoofing is blocked',
        field: 'Fintech',
        budget: 50000,
        deadline: '2026-12-31',
        entrepreneur_id: spoofedUserId // SPOOFING ATTEMPT
      },
      files: []
    };

    let responseData;
    let statusCode;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          }
        };
      }
    };

    await ProjectController.addProject(req, res);

    expect(statusCode).toBe(201);
    expect(responseData.entrepreneur_id).toBe(actualUserId);
    expect(responseData.entrepreneur_id).not.toBe(spoofedUserId);

    const savedProject = await Project.findOne({ project_name: 'Anti-Spoof Pitch' });
    expect(savedProject.entrepreneur_id).toBe(actualUserId);
  });

  it('2. Community Create: ignores spoofed admin_id in req.body and uses req.user.id', async () => {
    const actualAdminId = 'ACTUAL_ADMIN_ID_123';
    const spoofedAdminId = 'SPOOFED_ADMIN_ID_999';

    // Seed admin record so adminDao.isAdmin returns true
    await Admin.create({
      admin_id: actualAdminId,
      username: 'admin_test',
      email: 'admin@test.com',
      password: 'hashedpassword',
      role: 'ADMIN'
    });

    const req = {
      user: { id: actualAdminId, role: 'ADMIN' },
      body: {
        community_name: 'Anti-Spoof Community',
        description: 'Testing admin_id spoofing protection',
        admin_id: spoofedAdminId // SPOOFING ATTEMPT
      }
    };

    let responseData;
    let statusCode;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          }
        };
      }
    };

    await CommunityController.createCommunity(req, res);

    expect(statusCode).toBe(201);
    expect(responseData.community.admins).toContain(actualAdminId);
    expect(responseData.community.admins).not.toContain(spoofedAdminId);

    const savedComm = await Community.findOne({ community_name: 'Anti-Spoof Community' });
    expect(savedComm.admins).toContain(actualAdminId);
    expect(savedComm.admins).not.toContain(spoofedAdminId);
  });

  it('3. Message Send: ignores spoofed sender_id and message_id in req.body', async () => {
    const actualSenderId = 'ACTUAL_SENDER_ID_123';
    const spoofedSenderId = 'SPOOFED_SENDER_ID_999';
    const spoofedMessageId = 'SPOOFED_MSG_ID_999';

    const req = {
      user: { id: actualSenderId },
      body: {
        receiver_id: 'RECEIVER_ID_456',
        content: 'Testing message identity spoofing protection',
        sender_id: spoofedSenderId, // SPOOFING ATTEMPT
        message_id: spoofedMessageId // SPOOFING ATTEMPT
      }
    };

    let responseData;
    let statusCode;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          }
        };
      }
    };

    await MessageController.sendMessage(req, res);

    expect(statusCode).toBe(201);
    expect(responseData.sender_id).toBe(actualSenderId);
    expect(responseData.sender_id).not.toBe(spoofedSenderId);
    expect(responseData.message_id).not.toBe(spoofedMessageId);

    const savedMessage = await Message.findOne({ receiver_id: 'RECEIVER_ID_456' });
    expect(savedMessage.sender_id).toBe(actualSenderId);
    expect(savedMessage.message_id).not.toBe(spoofedMessageId);
  });
});
