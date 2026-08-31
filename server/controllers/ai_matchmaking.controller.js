import aiMatchmakingService from '../services/ai_matchmaking.service.js';
import Project from '../db/models/projectModel.js';
import InvestorMandate from '../db/models/investorMandateModel.js';

class AIMatchmakingController {
  /**
   * GET /api/matchmaking/deal-flow
   * Get AI-ranked personalized deal flow feed for logged-in investor
   */
  async getDealFlow(req, res) {
    try {
      const investorId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await aiMatchmakingService.getPersonalizedDealFlow(investorId, {
        page: Number(page),
        limit: Number(limit)
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('AI Matchmaking Deal Flow Error:', error);
      return res.status(500).json({ error: 'Failed to retrieve AI deal flow feed.' });
    }
  }

  /**
   * POST /api/matchmaking/mandate
   * Save or update investor investment mandate
   */
  async saveMandate(req, res) {
    try {
      const investorId = req.user.id;
      const mandateData = req.body;

      const mandate = await aiMatchmakingService.upsertInvestorMandate(investorId, mandateData);
      return res.status(200).json({ message: 'Investor mandate updated successfully', mandate });
    } catch (error) {
      console.error('Save Investor Mandate Error:', error);
      return res.status(500).json({ error: 'Failed to save investor mandate.' });
    }
  }

  /**
   * GET /api/matchmaking/match-score/:project_id
   * Calculate AI match score for a specific project vs logged-in investor
   */
  async getProjectMatchScore(req, res) {
    try {
      const { project_id } = req.params;
      const investorId = req.user.id;

      const project = await Project.findOne({ project_id });
      if (!project) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      const mandate = await InvestorMandate.findOne({ investor_id: investorId });
      const matchResult = aiMatchmakingService.calculateMatchScore(mandate, project);

      return res.status(200).json({ project_id, ai_match: matchResult });
    } catch (error) {
      console.error('Get Match Score Error:', error);
      return res.status(500).json({ error: 'Failed to calculate match score.' });
    }
  }
}

export default new AIMatchmakingController();
