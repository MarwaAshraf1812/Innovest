import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import aiMatchmakingService from '../services/ai_matchmaking.service.js';
import InvestorMandate from '../db/models/investorMandateModel.js';
import Project from '../db/models/projectModel.js';

describe('Phase 3: AI Vector Matchmaking Engine Tests', () => {
  let mongoServer;
  const testInvestorId = 'investor-ai-101';
  const testProjectId1 = 'project-ai-201';
  const testProjectId2 = 'project-ai-202';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Seed test projects
    await Project.create([
      {
        project_id: testProjectId1,
        project_name: 'BioClean Energy Grid',
        description: 'Micro-algae bio-fuel synthesis and clean tech solar inverter technology.',
        field: 'CleanTech',
        budget: 150000,
        approved: 'approved',
        entrepreneur_id: 'founder-1',
        deadline: '2026-12-31'
      },
      {
        project_id: testProjectId2,
        project_name: 'Luxury E-Commerce App',
        description: 'B2C retail marketplace for vintage fashion items.',
        field: 'E-commerce',
        budget: 5000000,
        approved: 'approved',
        entrepreneur_id: 'founder-2',
        deadline: '2026-12-31'
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  afterEach(async () => {
    await InvestorMandate.deleteMany({});
  });

  describe('1. AI Vector Similarity & Match Scoring', () => {
    it('should calculate high match score (>=85%) for perfect sector & check size alignment', async () => {
      const mandate = await aiMatchmakingService.upsertInvestorMandate(testInvestorId, {
        preferred_sectors: ['CleanTech', 'Solar'],
        min_check_size: 50000,
        max_check_size: 500000,
        target_countries: ['Egypt', 'Global'],
        investment_thesis: 'Sustainable bio-fuel and solar infrastructure startups.'
      });

      const cleanProject = await Project.findOne({ project_id: testProjectId1 });
      const matchResult = aiMatchmakingService.calculateMatchScore(mandate, cleanProject);

      expect(matchResult.match_score).toBeGreaterThanOrEqual(85);
      expect(matchResult.match_breakdown.sector_score).toBe(100);
      expect(matchResult.match_breakdown.budget_score).toBe(100);
      expect(matchResult.match_highlights.length).toBeGreaterThan(0);
    });

    it('should calculate lower match score for out-of-mandate project', async () => {
      const mandate = await aiMatchmakingService.upsertInvestorMandate(testInvestorId, {
        preferred_sectors: ['CleanTech'],
        min_check_size: 50000,
        max_check_size: 200000,
        target_countries: ['Egypt'],
        investment_thesis: 'Clean energy technology.'
      });

      const ecomProject = await Project.findOne({ project_id: testProjectId2 });
      const matchResult = aiMatchmakingService.calculateMatchScore(mandate, ecomProject);

      expect(matchResult.match_score).toBeLessThan(60);
    });
  });

  describe('2. Personalized AI Deal Flow Ranking', () => {
    it('should return projects ordered by AI match score descending', async () => {
      await aiMatchmakingService.upsertInvestorMandate(testInvestorId, {
        preferred_sectors: ['CleanTech'],
        min_check_size: 100000,
        max_check_size: 300000,
        investment_thesis: 'Bio-fuel grid models.'
      });

      const feed = await aiMatchmakingService.getPersonalizedDealFlow(testInvestorId, { page: 1, limit: 10 });

      expect(feed.deal_flow.length).toBe(2);
      // First project in feed should be the CleanTech project
      expect(feed.deal_flow[0].project_id).toBe(testProjectId1);
      expect(feed.deal_flow[0].ai_match.match_score).toBeGreaterThan(feed.deal_flow[1].ai_match.match_score);
    });
  });
});
