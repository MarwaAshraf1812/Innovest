const ProposalDAO = require('../common/daos/proposal.dao');


class ProposalService {
  async createProposal(proposalData, userId) {
    return await ProposalDAO.createProposal(proposalData, userId);
  }

  async getProposalsByEntrepreneur(entrepreneurId) {
    return ProposalDAO.getProposalsByEntrepreneur(entrepreneurId);
  }

  async getProposalsByProjects(projectId) {
    return ProposalDAO.getProposalsByProjects(projectId);
  }

  async getProposalById(proposalId) {
    return ProposalDAO.getProposalById(proposalId);
  }


  async updateProposal(proposalId, updateData) {
    return await ProposalDAO.updateProposal(proposalId, updateData);
  }

  async updateProposalStatus(proposalId, status) {
    return await ProposalDAO.updateProposalStatus(proposalId, status);
  }

  async deleteProposal(proposalId) {
    return await ProposalDAO.deleteProposal(proposalId);
  }
};

module.exports = ProposalService;
