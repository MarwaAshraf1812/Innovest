const ProposalService = require('../services/proposal.service');

class  ProposalController {
  async createProposal(req, res) {
    try {
      const { project_id, amount, milestones, benefits, terms } = req.body;
    } catch (error) {
      
    }
  }
}

module.exports = ProposalController;
