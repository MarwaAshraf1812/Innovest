import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dealRoomService from '../services/deal_room.service.js';
import DealRoom from '../db/models/dealRoomModel.js';
import Project from '../db/models/projectModel.js';

describe('Phase 4: Live Collaborative Deal Room & Term Sheet Generator Tests', () => {
  let mongoServer;
  const founderId = 'founder-user-1';
  const investorId = 'investor-user-2';
  const projectId = 'dealroom-proj-99';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    await Project.create({
      project_id: projectId,
      project_name: 'Innovest Deal Engine',
      description: 'Automated deal room testing',
      entrepreneur_id: founderId,
      field: 'Fintech',
      budget: 250000,
      approved: 'approved',
      deadline: '2026-12-31'
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  afterEach(async () => {
    await DealRoom.deleteMany({});
  });

  describe('1. Deal Room Creation & Initial Terms', () => {
    it('should create a new Deal Room with default SAFE terms and initial audit entry', async () => {
      const room = await dealRoomService.createDealRoom({
        founderId,
        investorId,
        projectId,
        investmentAmount: 150000,
        investmentType: 'SAFE_POST_MONEY'
      });

      expect(room.deal_room_id).toBeDefined();
      expect(room.status).toBe('DRAFTING');
      expect(room.term_sheet.investment_amount).toBe(150000);
      expect(room.audit_trail.length).toBe(1);
      expect(room.audit_trail[0].action).toBe('DEAL_ROOM_CREATED');
    });
  });

  describe('2. Term Sheet Redlining & Audit Trail Tracking', () => {
    it('should update valuation cap and append immutable action to audit trail', async () => {
      const room = await dealRoomService.createDealRoom({
        founderId,
        investorId,
        projectId,
        investmentAmount: 200000
      });

      const updated = await dealRoomService.updateTermSheet(room.deal_room_id, investorId, {
        valuation_cap: 6000000,
        discount_rate: 15
      });

      expect(updated.status).toBe('TERM_SHEET_SENT');
      expect(updated.term_sheet.valuation_cap).toBe(6000000);
      expect(updated.term_sheet.discount_rate).toBe(15);
      expect(updated.audit_trail.length).toBe(2);
      expect(updated.audit_trail[1].action).toContain('TERM_SHEET_UPDATED');
    });
  });

  describe('3. Digital Signature Execution & Status Transition', () => {
    it('should transition status to SIGNED when both founder and investor execute digital signatures', async () => {
      const room = await dealRoomService.createDealRoom({
        founderId,
        investorId,
        projectId,
        investmentAmount: 300000
      });

      // Founder signs first
      const afterFounderSig = await dealRoomService.signTermSheet(room.deal_room_id, founderId, {
        role: 'FOUNDER',
        ipAddress: '192.168.1.10'
      });

      expect(afterFounderSig.status).toBe('DRAFTING'); // Not SIGNED yet
      expect(afterFounderSig.term_sheet.signatures.length).toBe(1);

      // Investor signs second
      const afterInvestorSig = await dealRoomService.signTermSheet(room.deal_room_id, investorId, {
        role: 'INVESTOR',
        ipAddress: '10.0.0.5'
      });

      expect(afterInvestorSig.status).toBe('SIGNED');
      expect(afterInvestorSig.term_sheet.signatures.length).toBe(2);
      expect(afterInvestorSig.audit_trail.some((a) => a.action === 'DEAL_ROOM_EXECUTED_AND_CLOSED')).toBe(true);
    });

    it('should prevent modifications to term sheet after status is SIGNED', async () => {
      const room = await dealRoomService.createDealRoom({ founderId, investorId, projectId, investmentAmount: 100000 });

      await dealRoomService.signTermSheet(room.deal_room_id, founderId, { role: 'FOUNDER' });
      await dealRoomService.signTermSheet(room.deal_room_id, investorId, { role: 'INVESTOR' });

      await expect(
        dealRoomService.updateTermSheet(room.deal_room_id, founderId, { valuation_cap: 10000000 })
      ).rejects.toThrow('Cannot modify term sheet after execution');
    });
  });
});
