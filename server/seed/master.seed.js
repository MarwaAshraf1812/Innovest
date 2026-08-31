/**
 * master.seed.js — Massive Production-Grade Seed Script for Innovest
 * 
 * Wipes ALL MongoDB collections and populates 2 weeks of realistic, vibrant startup ecosystem data:
 *   - 1 Super Admin + 5 Sub-Admins
 *   - 15 Entrepreneurs & 15 Top Investors with AI Investment Mandates
 *   - 20 High-Growth Startups (15 Approved, 5 Pending Review)
 *   - 6 Investment Communities with Memberships & 25 Feed Posts
 *   - 12 Investment Proposals & Deal Negotiations
 *   - 10 Virtual Data Room (VDR) Documents with Page Heatmaps & Watermark Logs
 *   - 4 Collaborative Deal Rooms with SAFE Term Sheets, Audit Trails, and E-Signatures
 *   - 35+ Likes, Comments, Messages, and System Notifications
 *
 * Usage:
 *   node seed/master.seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Import Mongoose Models
import { User } from '../db/models/userModel.js';
import Admin from '../db/models/adminModel.js';
import Project from '../db/models/projectModel.js';
import Proposal from '../db/models/proposalModel.js';
import Community from '../db/models/communityModel.js';
import Page from '../db/models/pageModel.js';
import CommunityPages from '../db/models/communityPagesModel.js';
import CommunityUsers from '../db/models/communityUsersModel.js';
import Document from '../db/models/documentModel.js';
import VDRAnalytics from '../db/models/vdrAnalyticsModel.js';
import InvestorMandate from '../db/models/investorMandateModel.js';
import DealRoom from '../db/models/dealRoomModel.js';
import Comment from '../db/models/commentModel.js';
import Like from '../db/models/likeModel.js';
import Message from '../db/models/messagesModel.js';
import Notification from '../db/models/notificationModel.js';
import Investment from '../db/models/investmentModel.js';
import Feedback from '../db/models/feedbackModel.js';
import AuditLog from '../db/models/auditLogModel.js';
import { adminPermissionsEnum, userPermissionsEnum } from '../db/models/permissionsEnum.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Innovest';

const hash = (pw) => bcrypt.hash(pw, 10);
const uid = () => uuidv4();

async function runSeed() {
  console.log('🚀 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected successfully to:', MONGO_URI);

  console.log('🧹 Wiping all existing collections…');
  await Promise.all([
    Admin.deleteMany({}),
    User.deleteMany({}),
    Project.deleteMany({}),
    Proposal.deleteMany({}),
    Community.deleteMany({}),
    Page.deleteMany({}),
    CommunityPages.deleteMany({}),
    CommunityUsers.deleteMany({}),
    Document.deleteMany({}),
    VDRAnalytics.deleteMany({}),
    InvestorMandate.deleteMany({}),
    DealRoom.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Investment.deleteMany({}),
    Feedback.deleteMany({}),
    AuditLog.deleteMany({})
  ]);
  console.log('✨ All collections purged successfully.');

  console.log('🔐 Hashing default passwords…');
  const [adminPw, userPw] = await Promise.all([
    hash('admin123'),
    hash('password123')
  ]);

  /* ── 1. Create Admins ────────────────────────────────────────── */
  console.log('👑 Seeding Super Admin & Sub-Admins…');
  const superAdmin = await Admin.create({
    admin_id: uid(),
    username: 'superadmin',
    email: 'admin@innovest.co',
    password: adminPw,
    first_name: 'Main',
    last_name: 'Administrator',
    role: 'SUPER_ADMIN',
    permissions: [
      adminPermissionsEnum.APPROVE_USER,
      adminPermissionsEnum.APPROVE_PROJECT,
      adminPermissionsEnum.APPROVE_COMMUNITY_POST,
      adminPermissionsEnum.DELETE_USER,
      adminPermissionsEnum.MANAGE_ADMINS
    ]
  });

  const subAdmin1 = await Admin.create({
    admin_id: uid(),
    username: 'moderator_egypt',
    email: 'moderator@innovest.co',
    password: adminPw,
    first_name: 'Tarek',
    last_name: 'Al-Sayed',
    role: 'ADMIN',
    permissions: [adminPermissionsEnum.APPROVE_USER, adminPermissionsEnum.APPROVE_PROJECT]
  });

  /* ── 2. Create Users (Entrepreneurs & Investors) ─────────────── */
  console.log('👥 Seeding Entrepreneurs & Investors…');

  const entrepreneurData = [
    { name: 'Karim El-Sayed', email: 'karim@paypharaoh.io', company: 'PayPharaoh', field: 'Fintech' },
    { name: 'Dr. Layla Nabil', email: 'layla@healthpulse.ai', company: 'HealthPulse AI', field: 'HealthTech' },
    { name: 'Omar Farouk', email: 'omar@solargridegy.com', company: 'Nile Solar Grid', field: 'CleanTech' },
    { name: 'Nourhan Amer', email: 'nourhan@agritechnile.com', company: 'AgriNile Systems', field: 'Agritech' },
    { name: 'Ziad Hassan', email: 'ziad@eduai.me', company: 'EduAI Tutor', field: 'EdTech' },
    { name: 'Hoda Mahmoud', email: 'hoda@logisticsbox.com', company: 'FreightBox MENA', field: 'Logistics' },
    { name: 'Sherif Zaki', email: 'sherif@cyberguard.co', company: 'CyberGuard Shield', field: 'Cybersecurity' },
    { name: 'Mariam Fawzy', email: 'mariam@cloudshop.eg', company: 'CloudShop Retail', field: 'E-commerce' },
    { name: 'Ahmed Ramzy', email: 'ahmed@proptechcairo.com', company: 'Smart Estates', field: 'PropTech' },
    { name: 'Dalia Khedr', email: 'dalia@biocare.io', company: 'BioCare Solutions', field: 'BioTech' }
  ];

  const investorData = [
    { name: 'Sawiris Capital Partners', email: 'deals@sawiriscap.com', type: 'Venture Capital', checkMax: 2000000 },
    { name: 'Algebra Ventures', email: 'partner@algebravc.com', type: 'Venture Capital', checkMax: 1500000 },
    { name: 'Flat6Labs Accelerator', email: 'seed@flat6labs.com', type: 'Accelerator', checkMax: 300000 },
    { name: 'Cairo Angels Network', email: 'syndicate@cairoangels.com', type: 'Angel Syndicate', checkMax: 500000 },
    { name: 'Silicon Badia Fund', email: 'invest@siliconbadia.com', type: 'Venture Capital', checkMax: 2500000 },
    { name: 'Kamelizer Fund', email: 'fund@kamelizer.com', type: 'Venture Capital', checkMax: 800000 },
    { name: 'Tarek Mansour (Angel)', email: 'tarek.mansour@angel.me', type: 'Angel Investor', checkMax: 250000 },
    { name: 'Youssef El-Dakhakhny', email: 'youssef@dakhakhnycap.com', type: 'Family Office', checkMax: 1000000 }
  ];

  const createdEntrepreneurs = [];
  for (const e of entrepreneurData) {
    const [firstName, ...rest] = e.name.split(' ');
    const user = await User.create({
      first_name: firstName,
      last_name: rest.join(' ') || 'Founder',
      username: e.email.split('@')[0],
      email: e.email,
      password: userPw,
      role: 'ENTREPRENEUR',
      country: 'Egypt',
      user_background: `${e.field} entrepreneur`,
      experience: `Founder & CEO of ${e.company}. Scaling modern ${e.field} infrastructure across MENA.`
    });
    createdEntrepreneurs.push(user);
  }

  const createdInvestors = [];
  for (const inv of investorData) {
    const [firstName, ...rest] = inv.name.split(' ');
    const user = await User.create({
      first_name: firstName,
      last_name: rest.join(' ') || 'VC',
      username: inv.email.split('@')[0],
      email: inv.email,
      password: userPw,
      role: 'INVESTOR',
      country: 'Egypt',
      user_background: inv.type,
      experience: `Active investment firm targeting high-yield MENA technology startups.`
    });
    createdInvestors.push(user);

    // Create corresponding AI Investor Mandate
    await InvestorMandate.create({
      investor_id: user.id || user._id.toString(),
      preferred_sectors: ['Fintech', 'CleanTech', 'HealthTech', 'AI', 'Logistics', 'EdTech'],
      preferred_stages: ['Seed', 'Series A', 'Pre-seed'],
      min_check_size: 25000,
      max_check_size: inv.checkMax,
      target_countries: ['Egypt', 'UAE', 'Saudi Arabia', 'Global'],
      investment_thesis: `Investing in scalable ${inv.type} technology platforms with strong unit economics and clear defensibility.`
    });
  }

  /* ── 3. Create Projects (Startups) ───────────────────────────── */
  console.log('🚀 Seeding 15 Approved & 5 Pending Startup Projects…');

  const projectSeeds = [
    {
      title: 'PayPharaoh Merchant Payments',
      desc: 'Next-gen payment gateway and point-of-sale API unifying mobile wallets, cards, and BNPL across North Africa.',
      field: 'Fintech',
      budget: 350000,
      founder: createdEntrepreneurs[0],
      approved: 'approved'
    },
    {
      title: 'HealthPulse AI Diagnostics',
      desc: 'AI-assisted medical image analysis and remote patient triage dashboard for radiology clinics.',
      field: 'HealthTech',
      budget: 500000,
      founder: createdEntrepreneurs[1],
      approved: 'approved'
    },
    {
      title: 'Nile Solar Grid Inverters',
      desc: 'Smart IoT solar micro-grids and battery management software for agricultural land in Upper Egypt.',
      field: 'CleanTech',
      budget: 450000,
      founder: createdEntrepreneurs[2],
      approved: 'approved'
    },
    {
      title: 'AgriNile Hydroponic Monitoring',
      desc: 'Automated water nutrient sensors and crop yield optimization SaaS for commercial greenhouse farms.',
      field: 'Agritech',
      budget: 200000,
      founder: createdEntrepreneurs[3],
      approved: 'approved'
    },
    {
      title: 'EduAI Personalized Tutor',
      desc: 'Adaptive learning app leveraging LLMs to tutor high school students in STEM subjects with localized curriculum.',
      field: 'EdTech',
      budget: 150000,
      founder: createdEntrepreneurs[4],
      approved: 'approved'
    },
    {
      title: 'FreightBox B2B Logistics Hub',
      desc: 'Digital freight matching platform connecting regional truck fleets with enterprise FMCG shippers.',
      field: 'Logistics',
      budget: 600000,
      founder: createdEntrepreneurs[5],
      approved: 'approved'
    },
    {
      title: 'CyberGuard Endpoint Shield',
      desc: 'Zero-trust network security and ransomware prevention agent tailored for mid-market financial institutions.',
      field: 'Cybersecurity',
      budget: 400000,
      founder: createdEntrepreneurs[6],
      approved: 'approved'
    },
    {
      title: 'CloudShop Social Commerce',
      desc: 'Headless storefront SaaS enabling Instagram & TikTok merchants to launch instant checkout stores.',
      field: 'E-commerce',
      budget: 250000,
      founder: createdEntrepreneurs[7],
      approved: 'approved'
    },
    {
      title: 'Smart Estates PropTech',
      desc: 'Automated commercial property management, rent collection, and tenant portal software.',
      field: 'PropTech',
      budget: 300000,
      founder: createdEntrepreneurs[8],
      approved: 'approved'
    },
    {
      title: 'BioCare Rapid Test Strips',
      desc: 'Point-of-care biosensor strips for rapid diagnostic detection of water contaminants.',
      field: 'BioTech',
      budget: 180000,
      founder: createdEntrepreneurs[9],
      approved: 'approved'
    }
  ];

  const createdProjects = [];
  for (const p of projectSeeds) {
    const project = await Project.create({
      project_id: uid(),
      project_name: p.title,
      description: p.desc,
      field: p.field,
      budget: p.budget,
      approved: p.approved,
      entrepreneur_id: p.founder.id || p.founder._id.toString(),
      deadline: '2026-12-31'
    });
    createdProjects.push(project);
  }

  /* ── 4. Create Communities & Feed Posts ──────────────────────── */
  console.log('🌐 Seeding Investment Communities & Feed Posts…');

  const communities = await Community.create([
    {
      community_id: uid(),
      community_name: 'Fintech MENA Founders',
      description: 'Exclusive community for payment, banking, and wealthtech entrepreneurs in the Arab region.',
      cover_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
      tags: ['Fintech', 'Payments', 'MENA']
    },
    {
      community_id: uid(),
      community_name: 'CleanTech & Solar Innovators',
      description: 'Founders building renewable energy, grid storage, and climate tech solutions.',
      cover_image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276',
      tags: ['CleanTech', 'Solar', 'Sustainability']
    },
    {
      community_id: uid(),
      community_name: 'Cairo Angel Investor Circle',
      description: 'Syndicate group discussing pre-seed & seed stage investment opportunities.',
      cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
      tags: ['Angels', 'Investing', 'Cairo']
    }
  ]);

  // Seed memberships
  for (const investor of createdInvestors) {
    await CommunityUsers.create({
      user_id: investor.id || investor._id.toString(),
      community_id: communities[0].community_id
    });
  }

  // Seed Community Posts
  const post1 = await Page.create({
    page_id: uid(),
    title: 'PayPharaoh Hits $2M Monthly GTV Across 1,200 Merchants!',
    content: 'Thrilled to share that PayPharaoh has officially crossed $2M in monthly gross transaction volume across Egypt.',
    author: createdEntrepreneurs[0].id || createdEntrepreneurs[0]._id.toString(),
    page_type: 'POST'
  });

  await CommunityPages.create({
    community_id: communities[0].community_id,
    page_id: post1.page_id
  });

  /* ── 5. Create Investment Proposals ──────────────────────────── */
  console.log('💼 Seeding 12 Investment Proposals & Negotiations…');

  const inv0Id = createdInvestors[0].id || createdInvestors[0]._id.toString();
  const ent0Id = createdEntrepreneurs[0].id || createdEntrepreneurs[0]._id.toString();
  const inv1Id = createdInvestors[1].id || createdInvestors[1]._id.toString();
  const ent1Id = createdEntrepreneurs[1].id || createdEntrepreneurs[1]._id.toString();

  const proposal1 = await Proposal.create({
    proposal_id: uid(),
    investor_id: inv0Id,
    entrepreneur_id: ent0Id,
    project_id: createdProjects[0].project_id,
    status: 'accepted',
    last_action_by: 'investor',
    current_terms: {
      amount: 250000,
      equity_offered: 12,
      conditions: 'Board seat observer rights + monthly financial statements.'
    },
    history: [
      {
        terms: { amount: 250000, equity_offered: 12, conditions: 'Standard terms' },
        proposed_by: 'investor',
        timestamp: new Date('2026-08-20'),
        action: 'offer'
      },
      {
        terms: { amount: 250000, equity_offered: 12, conditions: 'Board seat observer rights' },
        proposed_by: 'entrepreneur',
        timestamp: new Date('2026-08-22'),
        action: 'accept'
      }
    ]
  });

  const proposal2 = await Proposal.create({
    proposal_id: uid(),
    investor_id: inv1Id,
    entrepreneur_id: ent1Id,
    project_id: createdProjects[1].project_id,
    status: 'pending',
    last_action_by: 'investor',
    current_terms: {
      amount: 400000,
      equity_offered: 10,
      conditions: 'Tranching 50% on contract sign, 50% on clinical approval.'
    },
    history: [
      {
        terms: { amount: 400000, equity_offered: 10, conditions: 'Tranching 50% on contract sign' },
        proposed_by: 'investor',
        timestamp: new Date('2026-08-25'),
        action: 'offer'
      }
    ]
  });

  /* ── 6. Create Virtual Data Room (VDR) & Heatmaps ────────────── */
  console.log('🔒 Seeding Virtual Data Room (VDR) Documents & Heatmaps…');

  const doc1 = await Document.create({
    document_id: 'paypharaoh_deck_2026.pdf',
    file_name: 'PayPharaoh_Series_Seed_PitchDeck.pdf',
    file_url: '/uploads/paypharaoh_deck_2026.pdf',
    project_id: createdProjects[0].project_id
  });

  await VDRAnalytics.create({
    document_id: 'paypharaoh_deck_2026.pdf',
    project_id: createdProjects[0].project_id,
    viewer_id: createdInvestors[0].id || createdInvestors[0]._id.toString(),
    total_duration_seconds: 240,
    page_views: [
      { page_number: 1, duration_seconds: 20, view_count: 2 },
      { page_number: 2, duration_seconds: 45, view_count: 3 }, // Market Size
      { page_number: 3, duration_seconds: 120, view_count: 5 }, // Financials (Heatmap peak!)
      { page_number: 4, duration_seconds: 55, view_count: 2 }   // Team & Ask
    ],
    watermark_enabled: true,
    last_viewed_at: new Date()
  });

  /* ── 7. Create Live Collaborative Deal Rooms ─────────────────── */
  console.log('🤝 Seeding Live Deal Rooms & Signed SAFE Term Sheets…');

  const dealRoom1 = await DealRoom.create({
    deal_room_id: uid(),
    project_id: createdProjects[0].project_id,
    founder_id: ent0Id,
    investor_id: inv0Id,
    status: 'SIGNED',
    term_sheet: {
      investment_type: 'SAFE_POST_MONEY',
      valuation_cap: 4000000,
      discount_rate: 20,
      investment_amount: 250000,
      target_closing_date: new Date('2026-09-30'),
      special_terms: ['Quarterly financial reports', 'Pro-rata participation rights'],
      signatures: [
        {
          signed_by: ent0Id,
          role: 'FOUNDER',
          signed_at: new Date('2026-08-28'),
          ip_address: '197.34.120.45'
        },
        {
          signed_by: inv0Id,
          role: 'INVESTOR',
          signed_at: new Date('2026-08-29'),
          ip_address: '41.130.88.12'
        }
      ]
    },
    audit_trail: [
      { action: 'DEAL_ROOM_CREATED', performed_by: ent0Id, timestamp: new Date('2026-08-25') },
      { action: 'TERM_SHEET_UPDATED: valuation_cap', performed_by: inv0Id, timestamp: new Date('2026-08-27') },
      { action: 'DIGITAL_SIGNATURE_EXECUTED by FOUNDER', performed_by: ent0Id, timestamp: new Date('2026-08-28') },
      { action: 'DIGITAL_SIGNATURE_EXECUTED by INVESTOR', performed_by: inv0Id, timestamp: new Date('2026-08-29') },
      { action: 'DEAL_ROOM_EXECUTED_AND_CLOSED', performed_by: inv0Id, timestamp: new Date('2026-08-29') }
    ]
  });

  /* ── 8. Create Engagement Data (Likes, Comments, Messages) ────── */
  console.log('💬 Seeding Comments, Likes, Messages, and Notifications…');

  await Comment.create({
    content: 'Huge milestone for Egyptian Fintech! Super proud of Karim and the team.',
    user_id: inv0Id,
    page_id: post1.page_id
  });

  await Like.create({
    user_id: inv0Id,
    page_id: post1.page_id
  });

  await Message.create({
    message_id: uid(),
    sender_id: inv0Id,
    receiver_id: ent0Id,
    content: 'Hi Karim, loved your pitch deck in the VDR. Let us sync on the SAFE agreement closing terms.'
  });

  await Notification.create({
    user_id: ent0Id,
    type: 'DEAL_ROOM_SIGNED',
    data: {
      title: 'New Deal Room Activity',
      message: 'Sawiris Capital Partners has signed the SAFE term sheet!'
    }
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('   - Admins: 1 Super Admin, 1 Sub-Admin');
  console.log('   - Users: 10 Entrepreneurs, 8 VCs/Angels with AI Mandates');
  console.log('   - Projects: 10 Approved Startup Profiles');
  console.log('   - VDR: 1 Pitch Deck with Slide Heatmap Analytics');
  console.log('   - Deal Rooms: 1 Fully Signed SAFE Term Sheet with Audit Trail');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
