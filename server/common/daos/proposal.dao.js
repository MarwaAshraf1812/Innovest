const Proposal = require('../../db/models/proposal.model');

const ProposalDAO = {
  
  async createProposal(proposalData) {
    console.log(proposalData);
    try {
      const proposal = new Proposal({ ...proposalData });
      console.log(proposal);
      return await proposal.save();
    } catch (error) {
      console.log('Error creating proposal: ' + error);
      throw new Error('Unable to create proposal');
    }
  },

  async getProposalByEntrepreneur(entrepreneurId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;
      return await Proposal.find({ entrepreneur_id: entrepreneurId })
      .skip(skip)
      .limit(limit);
    } catch (error) {
      console.error(
        `Error in getProposalsByEntrepreneur DAO for entrepreneurId: ${entrepreneurId}`,
        error
      );
      throw new Error('Unable to get proposal');
    }
  },

  async getProposalByProjects(projectId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;
      return await Proposal.find({ project_id: projectId })
      .skip(skip)
      .limit(limit);
    } catch (error) {
      console.log('Error getting proposal: ' + error);
      throw new Error('Unable to get proposal');
    }
  },

  async getProposalById(proposalId) {
    try {
      return await Proposal.findOne({ proposal_id: proposalId });
    } catch (error) {
      console.log('Error getting proposal: ' + error);
      throw new Error('Unable to get proposal');
    }
  },

  async updateProposal(proposalId, updateData) {
    try {
      return await Proposal.findOneAndUpdate(
        { proposal_id: proposalId },
        { $set: updateData },
        { new: true },
      );
    } catch (error) {
      console.log('Error updating proposal: ' + error);
      throw new Error('Unable to update proposal');
    }
  },

  async updateProposalStatus(proposalId, status) {
    try {
      return await Proposal.findOneAndUpdate(
        { proposal_id: proposalId },
        { $set: { status: status } },
        { new: true, runValidators: true },
      );
    } catch (error) {
      console.log('Error updating proposal status: ' + error);
      throw new Error('Unable to update proposal status');
    }
  },

  async deleteProposal(proposalId) {
    try {
      return await Proposal.findOneAndDelete({ proposal_id: proposalId });
    } catch (error) {
      console.log('Error deleting proposal: ' + error);
      throw new Error('Unable to delete proposal');
    }
  },
};

exports.ProposalDAO = ProposalDAO;
