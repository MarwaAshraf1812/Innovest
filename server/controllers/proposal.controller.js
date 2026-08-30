import ProposalService from '../services/proposal.service.js';

class ProposalController {
  async createProposal(req, res) {
    try {
      const userId = req.user.id; // Identity derived from JWT session
      const proposal = await ProposalService.createProposal(userId, req.body);
      return res.status(201).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async counterProposal(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const proposal = await ProposalService.counterProposal(id, userId, req.body);
      return res.status(200).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async acceptProposal(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const proposal = await ProposalService.acceptProposal(id, userId);
      return res.status(200).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async rejectProposal(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const proposal = await ProposalService.rejectProposal(id, userId);
      return res.status(200).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async withdrawProposal(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const proposal = await ProposalService.withdrawProposal(id, userId);
      return res.status(200).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async getProposalById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const proposal = await ProposalService.getProposalById(id, userId);
      return res.status(200).json(proposal);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async getProposalsForProject(req, res) {
    try {
      const userId = req.user.id;
      const { project_id } = req.params;
      const proposals = await ProposalService.getProposalsForProject(project_id, userId);
      return res.status(200).json(proposals);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }

  async getMyProposals(req, res) {
    try {
      const userId = req.user.id;
      const proposals = await ProposalService.getMyProposals(userId);
      return res.status(200).json(proposals);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ message: error.message });
    }
  }
}

export default new ProposalController();
