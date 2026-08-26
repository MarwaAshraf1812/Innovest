const mongoose = require('mongoose');
const Proposal = require('../db/models/proposalModel');
const Project = require('../db/models/projectModel');
const Investment = require('../db/models/investmentModel');
const { User } = require('../db/models/userModel');
const NotificationService = require('./notification.service');

class ProposalService {
  async createProposal(userId, { project_id, amount, equity_offered, conditions }) {
    // Find target project
    const project = await Project.findOne({
      $or: [{ project_id: project_id }, { _id: mongoose.isValidObjectId(project_id) ? project_id : null }]
    });

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.entrepreneur_id === userId) {
      const error = new Error('Entrepreneur cannot submit an investment proposal on their own project');
      error.statusCode = 400;
      throw error;
    }

    // Check for existing active negotiation
    const existingActive = await Proposal.findOne({
      project_id: project.project_id,
      investor_id: userId,
      status: { $in: ['pending', 'countered'] }
    });

    if (existingActive) {
      const error = new Error('An active proposal negotiation already exists for this project');
      error.statusCode = 409;
      throw error;
    }

    const terms = {
      amount: Number(amount),
      equity_offered: Number(equity_offered),
      conditions: conditions || ''
    };

    const newProposal = new Proposal({
      project_id: project.project_id,
      investor_id: userId, // Session derived
      entrepreneur_id: project.entrepreneur_id, // Server derived from project
      status: 'pending',
      last_action_by: 'investor',
      current_terms: terms,
      history: [{
        terms,
        proposed_by: 'investor',
        timestamp: new Date(),
        action: 'offer'
      }]
    });

    await newProposal.save();

    // Trigger Notification & Socket Event
    try {
      await NotificationService.notifyUser(project.entrepreneur_id, 'proposalReceived', {
        proposal_id: newProposal.proposal_id,
        project_id: project.project_id,
        project_name: project.project_name,
        investor_id: userId,
        message: `New investment offer received for "${project.project_name}".`
      });
    } catch (err) {
      console.error('Failed to notify entrepreneur of proposal:', err);
    }

    return newProposal;
  }

  async counterProposal(proposalId, userId, { amount, equity_offered, conditions }) {
    const proposal = await Proposal.findOne({
      $or: [{ proposal_id: proposalId }, { _id: mongoose.isValidObjectId(proposalId) ? proposalId : null }]
    });

    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    if (['accepted', 'rejected', 'withdrawn'].includes(proposal.status)) {
      const error = new Error(`Cannot counter a proposal with terminal status '${proposal.status}'`);
      error.statusCode = 409;
      throw error;
    }

    let requestingParty;
    if (userId === proposal.investor_id) {
      requestingParty = 'investor';
    } else if (userId === proposal.entrepreneur_id) {
      requestingParty = 'entrepreneur';
    } else {
      const error = new Error('Unauthorized: You are not a party to this proposal');
      error.statusCode = 403;
      throw error;
    }

    if (proposal.last_action_by === requestingParty) {
      const error = new Error('Cannot counter your own proposal. Awaiting response from other party.');
      error.statusCode = 409;
      throw error;
    }

    const newTerms = {
      amount: Number(amount),
      equity_offered: Number(equity_offered),
      conditions: conditions || ''
    };

    proposal.history.push({
      terms: newTerms,
      proposed_by: requestingParty,
      timestamp: new Date(),
      action: 'counter'
    });

    proposal.current_terms = newTerms;
    proposal.last_action_by = requestingParty;
    proposal.status = 'countered';

    await proposal.save();

    // Trigger Notification
    const targetUserId = requestingParty === 'investor' ? proposal.entrepreneur_id : proposal.investor_id;
    try {
      await NotificationService.notifyUser(targetUserId, 'proposalCountered', {
        proposal_id: proposal.proposal_id,
        project_id: proposal.project_id,
        countered_by: requestingParty,
        message: `A counter-offer has been submitted on proposal.`
      });
    } catch (err) {
      console.error('Failed to notify party of counter proposal:', err);
    }

    return proposal;
  }

  async acceptProposal(proposalId, userId) {
    const existing = await Proposal.findOne({
      $or: [{ proposal_id: proposalId }, { _id: mongoose.isValidObjectId(proposalId) ? proposalId : null }]
    });

    if (!existing) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    let requestingParty;
    if (userId === existing.investor_id) {
      requestingParty = 'investor';
    } else if (userId === existing.entrepreneur_id) {
      requestingParty = 'entrepreneur';
    } else {
      const error = new Error('Unauthorized: You are not a party to this proposal');
      error.statusCode = 403;
      throw error;
    }

    if (existing.last_action_by === requestingParty) {
      const error = new Error('You cannot accept your own offer.');
      error.statusCode = 409;
      throw error;
    }

    // Atomic update: filter status in ['pending', 'countered'] in single DB operation to prevent race conditions
    const proposal = await Proposal.findOneAndUpdate(
      {
        _id: existing._id,
        status: { $in: ['pending', 'countered'] }
      },
      {
        $set: { status: 'accepted' },
        $push: {
          history: {
            terms: existing.current_terms,
            proposed_by: requestingParty,
            timestamp: new Date(),
            action: 'accept'
          }
        }
      },
      { new: true }
    );

    if (!proposal) {
      const error = new Error(`Cannot accept a proposal with terminal status '${existing.status}'`);
      error.statusCode = 409;
      throw error;
    }

    // Reflect deal on Project model and create completed Investment
    try {
      const project = await Project.findOne({ project_id: proposal.project_id });
      if (project) {
        project.offer = (project.offer || 0) + proposal.current_terms.amount;
        if (project.target && project.offer >= project.target) {
          project.status = 'funded';
        }
        await project.save();

        const investorUser = await User.findOne({ id: proposal.investor_id });
        if (investorUser) {
          const investment = new Investment({
            proposal_id: project._id,
            investor_id: investorUser._id,
            project_id: project._id,
            amount_invested: proposal.current_terms.amount,
            payment_status: 'completed'
          });
          await investment.save();
        }
      }
    } catch (err) {
      console.error('Failed to sync accepted deal to Project/Investment:', err);
    }

    // Trigger Notification
    const targetUserId = requestingParty === 'investor' ? proposal.entrepreneur_id : proposal.investor_id;
    try {
      await NotificationService.notifyUser(targetUserId, 'proposalAccepted', {
        proposal_id: proposal.proposal_id,
        project_id: proposal.project_id,
        message: `Proposal has been accepted!`
      });
    } catch (err) {
      console.error('Failed to notify party of proposal acceptance:', err);
    }

    return proposal;
  }

  async rejectProposal(proposalId, userId) {
    const proposal = await Proposal.findOne({
      $or: [{ proposal_id: proposalId }, { _id: mongoose.isValidObjectId(proposalId) ? proposalId : null }]
    });

    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    if (['accepted', 'rejected', 'withdrawn'].includes(proposal.status)) {
      const error = new Error(`Cannot reject a proposal with terminal status '${proposal.status}'`);
      error.statusCode = 409;
      throw error;
    }

    let requestingParty;
    if (userId === proposal.investor_id) {
      requestingParty = 'investor';
    } else if (userId === proposal.entrepreneur_id) {
      requestingParty = 'entrepreneur';
    } else {
      const error = new Error('Unauthorized: You are not a party to this proposal');
      error.statusCode = 403;
      throw error;
    }

    proposal.status = 'rejected';
    proposal.history.push({
      terms: proposal.current_terms,
      proposed_by: requestingParty,
      timestamp: new Date(),
      action: 'reject'
    });

    await proposal.save();

    const targetUserId = requestingParty === 'investor' ? proposal.entrepreneur_id : proposal.investor_id;
    try {
      await NotificationService.notifyUser(targetUserId, 'proposalRejected', {
        proposal_id: proposal.proposal_id,
        project_id: proposal.project_id,
        message: `Proposal has been rejected.`
      });
    } catch (err) {
      console.error('Failed to notify party of proposal rejection:', err);
    }

    return proposal;
  }

  async withdrawProposal(proposalId, userId) {
    const proposal = await Proposal.findOne({
      $or: [{ proposal_id: proposalId }, { _id: mongoose.isValidObjectId(proposalId) ? proposalId : null }]
    });

    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    if (['accepted', 'rejected', 'withdrawn'].includes(proposal.status)) {
      const error = new Error(`Cannot withdraw a proposal with terminal status '${proposal.status}'`);
      error.statusCode = 409;
      throw error;
    }

    if (userId !== proposal.investor_id) {
      const error = new Error('Unauthorized: Only the investor can withdraw this proposal');
      error.statusCode = 403;
      throw error;
    }

    proposal.status = 'withdrawn';
    proposal.history.push({
      terms: proposal.current_terms,
      proposed_by: 'investor',
      timestamp: new Date(),
      action: 'withdraw'
    });

    await proposal.save();

    try {
      await NotificationService.notifyUser(proposal.entrepreneur_id, 'proposalWithdrawn', {
        proposal_id: proposal.proposal_id,
        project_id: proposal.project_id,
        message: `Investor has withdrawn their proposal.`
      });
    } catch (err) {
      console.error('Failed to notify entrepreneur of proposal withdrawal:', err);
    }

    return proposal;
  }

  async getProposalById(proposalId, userId) {
    const proposal = await Proposal.findOne({
      $or: [{ proposal_id: proposalId }, { _id: mongoose.isValidObjectId(proposalId) ? proposalId : null }]
    });

    if (!proposal) {
      const error = new Error('Proposal not found');
      error.statusCode = 404;
      throw error;
    }

    if (proposal.investor_id !== userId && proposal.entrepreneur_id !== userId) {
      const error = new Error('Unauthorized: You cannot access this proposal');
      error.statusCode = 403;
      throw error;
    }

    return proposal;
  }

  async getProposalsForProject(projectId, userId) {
    const project = await Project.findOne({
      $or: [{ project_id: projectId }, { _id: mongoose.isValidObjectId(projectId) ? projectId : null }]
    });

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.entrepreneur_id !== userId) {
      const error = new Error('Unauthorized: Only the project entrepreneur can view all project proposals');
      error.statusCode = 403;
      throw error;
    }

    return await Proposal.find({ project_id: project.project_id }).sort({ updated_at: -1 });
  }

  async getMyProposals(userId) {
    return await Proposal.find({
      $or: [{ investor_id: userId }, { entrepreneur_id: userId }]
    }).sort({ updated_at: -1 });
  }
}

module.exports = new ProposalService();
