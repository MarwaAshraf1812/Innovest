import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ProposalController from '../controllers/proposal.controller.js';
import Proposal from '../db/models/proposalModel.js';
import Project from '../db/models/projectModel.js';
import Investment from '../db/models/investmentModel.js';
import { User } from '../db/models/userModel.js';

describe('Proposal Negotiation System Tests', () => {
  let mongoServer;
  const entrepreneurId = 'ENTREPRENEUR_ID_100';
  const investor1Id = 'INVESTOR_ID_200';
  const investor2Id = 'INVESTOR_ID_300';
  let testProject;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Proposal.deleteMany({});
    await Project.deleteMany({});
    await Investment.deleteMany({});
    await User.deleteMany({});

    // Create investor user record
    await User.create({
      id: investor1Id,
      first_name: 'Investor',
      last_name: 'One',
      username: 'investor_one',
      email: 'inv1@test.com',
      password: 'password123',
      role: 'INVESTOR'
    });

    // Create test project owned by entrepreneurId
    testProject = await Project.create({
      project_name: 'Innovest Tech Pitch',
      description: 'Fintech platform for startup investing',
      entrepreneur_id: entrepreneurId,
      status: 'under review',
      field: 'Fintech',
      budget: 100000,
      deadline: '2026-12-31'
    });
  });

  function mockReqRes(user, body = {}, params = {}) {
    let responseData;
    let statusCode;
    const req = { user, body, params };
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
    return { req, res, getStatus: () => statusCode, getData: () => responseData };
  }

  it('1. Full Negotiation Flow: Offer -> Counter -> Counter -> Accept', async () => {
    // Round 1: Investor submits initial offer ($50,000 for 10%)
    const offerReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { project_id: testProject.project_id, amount: 50000, equity_offered: 10, conditions: 'Milestone 1 check' }
    );
    await ProposalController.createProposal(offerReq.req, offerReq.res);

    expect(offerReq.getStatus()).toBe(201);
    const proposal = offerReq.getData();
    expect(proposal.status).toBe('pending');
    expect(proposal.last_action_by).toBe('investor');
    expect(proposal.current_terms.amount).toBe(50000);

    // Round 2: Entrepreneur counters ($75,000 for 15%)
    const counter1Req = mockReqRes(
      { id: entrepreneurId, role: 'ENTREPRENEUR' },
      { amount: 75000, equity_offered: 15, conditions: 'Quarterly reporting' },
      { id: proposal.proposal_id }
    );
    await ProposalController.counterProposal(counter1Req.req, counter1Req.res);

    expect(counter1Req.getStatus()).toBe(200);
    const counter1 = counter1Req.getData();
    expect(counter1.status).toBe('countered');
    expect(counter1.last_action_by).toBe('entrepreneur');
    expect(counter1.current_terms.amount).toBe(75000);
    expect(counter1.history.length).toBe(2);

    // Round 3: Investor counters back ($65,000 for 12%)
    const counter2Req = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { amount: 65000, equity_offered: 12, conditions: 'Bimonthly reporting' },
      { id: proposal.proposal_id }
    );
    await ProposalController.counterProposal(counter2Req.req, counter2Req.res);

    expect(counter2Req.getStatus()).toBe(200);
    const counter2 = counter2Req.getData();
    expect(counter2.status).toBe('countered');
    expect(counter2.last_action_by).toBe('investor');
    expect(counter2.current_terms.amount).toBe(65000);

    // Round 4: Entrepreneur accepts agreed terms ($65,000 for 12%)
    const acceptReq = mockReqRes(
      { id: entrepreneurId, role: 'ENTREPRENEUR' },
      {},
      { id: proposal.proposal_id }
    );
    await ProposalController.acceptProposal(acceptReq.req, acceptReq.res);

    expect(acceptReq.getStatus()).toBe(200);
    const accepted = acceptReq.getData();
    expect(accepted.status).toBe('accepted');
    expect(accepted.history.length).toBe(4);

    // Verify investment recorded and project offer updated
    const updatedProject = await Project.findOne({ project_id: testProject.project_id });
    expect(updatedProject.offer).toBe(65000);

    const investment = await Investment.findOne({ project_id: testProject._id });
    expect(investment).not.toBeNull();
    expect(investment.amount_invested).toBe(65000);
    expect(investment.payment_status).toBe('completed');
  });

  it('2. Authorization Rules: Investor cannot accept own offer & Unrelated user blocked', async () => {
    // Investor creates initial offer
    const offerReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { project_id: testProject.project_id, amount: 50000, equity_offered: 10 }
    );
    await ProposalController.createProposal(offerReq.req, offerReq.res);
    const proposal = offerReq.getData();

    // Investor tries to accept their own offer -> Blocked
    const ownAcceptReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      {},
      { id: proposal.proposal_id }
    );
    await ProposalController.acceptProposal(ownAcceptReq.req, ownAcceptReq.res);
    expect(ownAcceptReq.getStatus()).toBe(409);

    // Unrelated user (investor2) tries to view/counter proposal -> Blocked (403)
    const unrelatedReq = mockReqRes(
      { id: investor2Id, role: 'INVESTOR' },
      { amount: 100000, equity_offered: 20 },
      { id: proposal.proposal_id }
    );
    await ProposalController.counterProposal(unrelatedReq.req, unrelatedReq.res);
    expect(unrelatedReq.getStatus()).toBe(403);
  });

  it('3. Identity Spoofing Protection: investor_id and entrepreneur_id derived strictly from session/server', async () => {
    const spoofedInvestorId = 'SPOOFED_INVESTOR_999';
    const spoofedEntrepreneurId = 'SPOOFED_ENTREPRENEUR_999';

    const reqData = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      {
        project_id: testProject.project_id,
        amount: 50000,
        equity_offered: 10,
        investor_id: spoofedInvestorId,       // SPOOFING ATTEMPT
        entrepreneur_id: spoofedEntrepreneurId // SPOOFING ATTEMPT
      }
    );

    await ProposalController.createProposal(reqData.req, reqData.res);

    expect(reqData.getStatus()).toBe(201);
    const created = reqData.getData();
    expect(created.investor_id).toBe(investor1Id);
    expect(created.investor_id).not.toBe(spoofedInvestorId);
    expect(created.entrepreneur_id).toBe(entrepreneurId);
    expect(created.entrepreneur_id).not.toBe(spoofedEntrepreneurId);
  });

  it('4. Terminal States Protection: No mutations allowed after accept/reject/withdraw', async () => {
    // Investor creates offer and then rejects it (or entrepreneur rejects it)
    const offerReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { project_id: testProject.project_id, amount: 50000, equity_offered: 10 }
    );
    await ProposalController.createProposal(offerReq.req, offerReq.res);
    const proposal = offerReq.getData();

    const rejectReq = mockReqRes(
      { id: entrepreneurId, role: 'ENTREPRENEUR' },
      {},
      { id: proposal.proposal_id }
    );
    await ProposalController.rejectProposal(rejectReq.req, rejectReq.res);
    expect(rejectReq.getStatus()).toBe(200);

    // Try to counter rejected proposal -> Should return 409 Conflict
    const postRejectCounterReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { amount: 60000, equity_offered: 12 },
      { id: proposal.proposal_id }
    );
    await ProposalController.counterProposal(postRejectCounterReq.req, postRejectCounterReq.res);
    expect(postRejectCounterReq.getStatus()).toBe(409);
  });

  it('5. Turn Enforcement: Investor submits offer and immediately tries to counter again before entrepreneur responds -> Rejected (409)', async () => {
    // Step 1: Investor submits initial offer ($50,000 for 10%)
    const offerReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { project_id: testProject.project_id, amount: 50000, equity_offered: 10 }
    );
    await ProposalController.createProposal(offerReq.req, offerReq.res);

    expect(offerReq.getStatus()).toBe(201);
    const proposal = offerReq.getData();
    expect(proposal.last_action_by).toBe('investor');

    // Step 2: SAME Investor tries to submit a counter-offer before entrepreneur responds
    const sameInvestorCounterReq = mockReqRes(
      { id: investor1Id, role: 'INVESTOR' },
      { amount: 60000, equity_offered: 12 },
      { id: proposal.proposal_id }
    );
    await ProposalController.counterProposal(sameInvestorCounterReq.req, sameInvestorCounterReq.res);

    // Expect request to be REJECTED with 409 Conflict (awaiting response from other party)
    expect(sameInvestorCounterReq.getStatus()).toBe(409);
    expect(sameInvestorCounterReq.getData().message).toMatch(/Cannot counter your own proposal/i);

    // Verify DB state: history length remains 1, last_action_by remains 'investor'
    const fetchedProposal = await Proposal.findOne({ proposal_id: proposal.proposal_id });
    expect(fetchedProposal.history.length).toBe(1);
    expect(fetchedProposal.last_action_by).toBe('investor');
    expect(fetchedProposal.current_terms.amount).toBe(50000);
  });
});
