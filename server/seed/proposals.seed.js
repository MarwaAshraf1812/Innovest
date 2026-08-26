const mongoose = require('mongoose');
const { User } = require('../db/models/userModel');
const Project = require('../db/models/projectModel');
const Proposal = require('../db/models/proposalModel');
const { v4: uuidv4 } = require('uuid');

const MONGO_URI = 'mongodb://localhost:27017/Innovest';

async function seedProposals() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    const omar = await User.findOne({ username: 'omarhassan' });
    const sarah = await User.findOne({ username: 'sarahjenkins' });

    if (!omar || !sarah) {
      console.error('Users omarhassan or sarahjenkins not found. Run node seed/users.seed.js first.');
      process.exit(1);
    }

    console.log(`Found Entrepreneur Omar (id: ${omar.id}) and Investor Sarah (id: ${sarah.id})`);

    // Clean existing seed projects and proposals for these users
    await Project.deleteMany({ entrepreneur_id: omar.id });
    await Proposal.deleteMany({ entrepreneur_id: omar.id });

    // 1. Create Sample Approved Projects for Omar
    const project1 = new Project({
      project_id: uuidv4(),
      project_name: 'Innovest AI Engine',
      description: 'Next-gen AI recommendation system for automated startup valuation and pitch deck analysis.',
      entrepreneur_id: omar.id,
      field: 'Fintech / AI',
      budget: 150000,
      target: 150000,
      offer: 0,
      approved: 'approved',
      status: 'under review',
      deadline: '2026-12-31'
    });
    await project1.save();

    const project2 = new Project({
      project_id: uuidv4(),
      project_name: 'GreenLoop CleanTech',
      description: 'Sustainable smart recycling network connecting local businesses with industrial recyclers.',
      entrepreneur_id: omar.id,
      field: 'CleanTech',
      budget: 80000,
      target: 80000,
      offer: 0,
      approved: 'approved',
      status: 'under review',
      deadline: '2026-11-30'
    });
    await project2.save();

    console.log('Seeded 2 Approved Projects for Omar Hassan.');

    // 2. Create Sample Proposal 1: Status = 'pending' (Awaiting Omar's response)
    const proposal1 = new Proposal({
      proposal_id: uuidv4(),
      project_id: project1.project_id,
      investor_id: sarah.id,
      entrepreneur_id: omar.id,
      status: 'pending',
      last_action_by: 'investor',
      current_terms: {
        amount: 50000,
        equity_offered: 10,
        conditions: 'Quarterly financial report and 1 advisory board seat.'
      },
      history: [
        {
          terms: {
            amount: 50000,
            equity_offered: 10,
            conditions: 'Quarterly financial report and 1 advisory board seat.'
          },
          proposed_by: 'investor',
          timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
          action: 'offer'
        }
      ]
    });
    await proposal1.save();

    // 3. Create Sample Proposal 2: Status = 'countered' (Awaiting Sarah's response)
    const proposal2 = new Proposal({
      proposal_id: uuidv4(),
      project_id: project2.project_id,
      investor_id: sarah.id,
      entrepreneur_id: omar.id,
      status: 'countered',
      last_action_by: 'entrepreneur',
      current_terms: {
        amount: 60000,
        equity_offered: 12.5,
        conditions: 'Bimonthly milestone sync and $60k tranche release upon MVP demo.'
      },
      history: [
        {
          terms: {
            amount: 40000,
            equity_offered: 8,
            conditions: 'Initial seed offer.'
          },
          proposed_by: 'investor',
          timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
          action: 'offer'
        },
        {
          terms: {
            amount: 60000,
            equity_offered: 12.5,
            conditions: 'Bimonthly milestone sync and $60k tranche release upon MVP demo.'
          },
          proposed_by: 'entrepreneur',
          timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
          action: 'counter'
        }
      ]
    });
    await proposal2.save();

    console.log('Seeded 2 Active Proposal Negotiations (1 Pending, 1 Countered).');
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding proposals:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedProposals();
