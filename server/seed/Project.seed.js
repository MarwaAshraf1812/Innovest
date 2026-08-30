import mongoose from 'mongoose';
import Project from '../db/models/projectModel.js';
import { User } from '../db/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/Innovest";

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    // Find the entrepreneur omarhassan
    const omar = await User.findOne({ username: 'omarhassan' });
    let entrepreneurId = '32c6b77e-87b5-4bba-8e24-7106b02cccf0'; // Default fallback

    if (omar) {
      entrepreneurId = omar.id;
      console.log(`Found user 'omarhassan' with id: ${entrepreneurId}`);
    } else {
      console.log(`User 'omarhassan' not found. Using default ID: ${entrepreneurId}`);
    }

    const projects = [
      {
        project_name: 'Quantum Biotech Labs',
        description: 'Developing next-generation targeted enzyme treatments for cancer therapies with advanced nanotechnology.',
        entrepreneur_id: entrepreneurId,
        status: 'under review',
        approved: 'approved',
        visibility: true,
        field: 'Biotech',
        budget: 1200000,
        offer: 850000,
        target: 1200000,
        deadline: 'Sep 30, 2026',
        documents: ['/documents/nanotech-proposal.pdf']
      },
      {
        project_name: 'SolarFlow Grid',
        description: 'Smart power distribution panels designed for residential microgrid applications and high-efficiency home power management.',
        entrepreneur_id: entrepreneurId,
        status: 'funding',
        approved: 'approved',
        visibility: true,
        field: 'Cleantech',
        budget: 500000,
        offer: 320000,
        target: 500000,
        deadline: 'Oct 15, 2026',
        documents: ['/documents/solar-cost-analysis.pdf']
      },
      {
        project_name: 'Alpha Robotics API',
        description: 'Unified control system API for multi-vendor industrial assembly arms to streamline factory automation.',
        entrepreneur_id: entrepreneurId,
        status: 'funded',
        approved: 'approved',
        visibility: true,
        field: 'Software',
        budget: 1500000,
        offer: 1500000,
        target: 1500000,
        deadline: 'Dec 01, 2026',
        documents: ['/documents/robotics-whitepaper.pdf']
      },
      {
        project_name: 'SmartHome Automation System',
        description: 'A cutting-edge automation system for smart homes, including AI-driven control for appliances, security, and energy management.',
        entrepreneur_id: entrepreneurId,
        status: 'under review',
        approved: 'pending',
        visibility: true,
        field: 'Technology',
        budget: 50000,
        offer: 12000,
        target: 60000,
        deadline: 'Jun 15, 2026',
        documents: ['/documents/smart-home-proposal.pdf']
      },
      {
        project_name: 'Blockchain-Based Voting Platform',
        description: 'A secure, decentralized platform for online voting with blockchain technology ensuring transparency and safety.',
        entrepreneur_id: entrepreneurId,
        status: 'under review',
        approved: 'pending',
        visibility: false,
        field: 'Blockchain',
        budget: 100000,
        offer: 0,
        target: 110000,
        deadline: 'Dec 05, 2026',
        documents: ['/documents/blockchain-voting-whitepaper.pdf']
      },
      {
        project_name: 'AI-Powered Market Research Tool',
        description: 'A tool that uses AI and machine learning to provide in-depth market analysis and trend forecasting.',
        entrepreneur_id: entrepreneurId,
        status: 'under review',
        approved: 'pending',
        visibility: false,
        field: 'Artificial Intelligence',
        budget: 80000,
        offer: 0,
        target: 85000,
        deadline: 'Aug 01, 2026',
        documents: ['/documents/ai-market-research-proposal.pdf']
      },
      {
        project_name: 'Eco-Friendly Packaging Initiative',
        description: 'A sustainable packaging initiative that was rejected during technical verification due to lack of material certifications.',
        entrepreneur_id: entrepreneurId,
        status: 'under review',
        approved: 'rejected',
        visibility: false,
        field: 'Environmental',
        budget: 60000,
        offer: 0,
        target: 62000,
        deadline: 'Jul 25, 2026',
        documents: ['/documents/eco-packaging.pdf']
      }
    ];

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects.');

    // Seed new projects
    const seeded = await Project.insertMany(projects);
    console.log(`Successfully seeded ${seeded.length} projects!`);

  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    mongoose.connection.close();
  }
}
