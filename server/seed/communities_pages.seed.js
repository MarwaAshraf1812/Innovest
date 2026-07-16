const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../db/models/userModel');
const Admin = require('../db/models/adminModel');
const Community = require('../db/models/communityModel');
const Page = require('../db/models/pageModel');
const CommunityPages = require('../db/models/communityPagesModel');
const CommunityUsers = require('../db/models/communityUsersModel');

const MONGO_URI = 'mongodb://localhost:27017/Innovest';

async function seedCommunitiesAndPages() {
  try {
    console.log('Connecting to database:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // 1. Fetch needed user references
    const adminUser = await Admin.findOne({ username: 'admin' });
    const omar = await User.findOne({ username: 'omarhassan' });
    const sarah = await User.findOne({ username: 'sarahjenkins' });

    if (!adminUser || !omar || !sarah) {
      console.error('Error: Please run users.seed.js first to seed the main admin and members!');
      return;
    }

    console.log('Cleaning up existing communities, pages, and relationships...');
    await Community.deleteMany({});
    await Page.deleteMany({});
    await CommunityPages.deleteMany({});
    await CommunityUsers.deleteMany({});

    // 2. Define Communities
    const comm1Id = uuidv4();
    const comm2Id = uuidv4();

    const cleanEnergyCommunity = new Community({
      community_id: comm1Id,
      community_name: 'Clean Energy Pioneers',
      description: 'Discuss bio-fuel, solar grids, wind energy innovations and clean technology investments.',
      image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
      admins: [adminUser.admin_id],
      member_count: 2,
      page_count: 2,
      tags: ['solar', 'biotech', 'clean-tech'],
      pages: [],
      users: []
    });

    const techHubCommunity = new Community({
      community_id: comm2Id,
      community_name: 'Tech Innovations Hub',
      description: 'Unifying robotics engineering, micro-controller firmware, API integrations, and hardware startups.',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      admins: [adminUser.admin_id],
      member_count: 2,
      page_count: 1,
      tags: ['software', 'api', 'robotics'],
      pages: [],
      users: []
    });

    // 3. Define Community Member Connections (APPROVED)
    const omarComm1 = new CommunityUsers({
      user_id: omar.id,
      community_id: comm1Id,
      member_status: 'APPROVED',
      role: 'MEMBER'
    });
    const sarahComm1 = new CommunityUsers({
      user_id: sarah.id,
      community_id: comm1Id,
      member_status: 'APPROVED',
      role: 'MEMBER'
    });

    const omarComm2 = new CommunityUsers({
      user_id: omar.id,
      community_id: comm2Id,
      member_status: 'APPROVED',
      role: 'MEMBER'
    });
    const sarahComm2 = new CommunityUsers({
      user_id: sarah.id,
      community_id: comm2Id,
      member_status: 'APPROVED',
      role: 'MEMBER'
    });

    await omarComm1.save();
    await sarahComm1.save();
    await omarComm2.save();
    await sarahComm2.save();

    cleanEnergyCommunity.users = [omarComm1._id.toString(), sarahComm1._id.toString()];
    techHubCommunity.users = [omarComm2._id.toString(), sarahComm2._id.toString()];

    // 4. Define and Seed Page Posts
    // Page 1: Approved bio-fuel post in Clean Energy Pioneers
    const page1Id = uuidv4();
    const page1 = new Page({
      page_id: page1Id,
      title: 'Next-Gen Bio-Fuel Grids',
      content: 'Bio-fuel synthesis using modified micro-algae has shown high energy density returns in our preliminary testing phase. We are looking for clean energy investors to join our pilot group.',
      location: 'Cairo, Egypt',
      page_type: 'ARTICLE',
      likes: 12,
      comments: 3,
      tags: ['biotech', 'clean-tech'],
      author: omar.id
    });
    await page1.save();

    const linkPage1 = new CommunityPages({
      community_id: comm1Id,
      page_id: page1Id,
      page_status: 'APPROVED',
      approved_by: adminUser.admin_id,
      visibility: true
    });
    await linkPage1.save();

    // Page 2: Approved solar post in Clean Energy Pioneers
    const page2Id = uuidv4();
    const page2 = new Page({
      page_id: page2Id,
      title: 'Residential Solar Net Metering Setup',
      content: 'Pitching a smart micro-inverter setup that interfaces directly with local municipal net metering protocols to optimize domestic solar yield.',
      location: 'Austin, TX',
      page_type: 'PROJECT_INFO',
      likes: 8,
      comments: 1,
      tags: ['solar', 'clean-tech'],
      author: omar.id
    });
    await page2.save();

    const linkPage2 = new CommunityPages({
      community_id: comm1Id,
      page_id: page2Id,
      page_status: 'APPROVED',
      approved_by: adminUser.admin_id,
      visibility: true
    });
    await linkPage2.save();

    // Page 3: PENDING post in Clean Energy Pioneers (For Admin Vetting testing!)
    const page3Id = uuidv4();
    const page3 = new Page({
      page_id: page3Id,
      title: 'Superconducting Rings for Offshore Wind Turbines',
      content: 'We are seeking $300k to manufacture a sub-zero cooling ring prototype for offshore wind generator shafts. This increases efficiency by up to 14%.',
      location: 'Alexandria, Egypt',
      page_type: 'POST',
      likes: 0,
      comments: 0,
      tags: ['clean-tech'],
      author: omar.id
    });
    await page3.save();

    const linkPage3 = new CommunityPages({
      community_id: comm1Id,
      page_id: page3Id,
      page_status: 'PENDING',
      visibility: false
    });
    await linkPage3.save();

    // Page 4: Approved robotics post in Tech Innovations Hub
    const page4Id = uuidv4();
    const page4 = new Page({
      page_id: page4Id,
      title: 'Vapor API: Standardizing Robot Arm Interfaces',
      content: 'A uniform SDK that enables ROS2 nodes to exchange joint-state data with Fanuc, Kuka, and Universal Robots hardware seamlessly.',
      location: 'Boston, MA',
      page_type: 'ARTICLE',
      likes: 24,
      comments: 5,
      tags: ['api', 'robotics'],
      author: omar.id
    });
    await page4.save();

    const linkPage4 = new CommunityPages({
      community_id: comm2Id,
      page_id: page4Id,
      page_status: 'APPROVED',
      approved_by: adminUser.admin_id,
      visibility: true
    });
    await linkPage4.save();

    // Page 5: PENDING post in Tech Innovations Hub (For Admin Vetting testing!)
    const page5Id = uuidv4();
    const page5 = new Page({
      page_id: page5Id,
      title: 'Autonomous Quadcopter Swarm API',
      content: 'Testing dynamic waypoint allocation models in localized GPS-denied configurations. Seeking developer feedback.',
      location: 'Cairo, Egypt',
      page_type: 'POST',
      likes: 0,
      comments: 0,
      tags: ['robotics'],
      author: omar.id
    });
    await page5.save();

    const linkPage5 = new CommunityPages({
      community_id: comm2Id,
      page_id: page5Id,
      page_status: 'PENDING',
      visibility: false
    });
    await linkPage5.save();

    // 5. Link approved page IDs into the community page array
    cleanEnergyCommunity.pages = [page1Id, page2Id];
    techHubCommunity.pages = [page4Id];

    await cleanEnergyCommunity.save();
    await techHubCommunity.save();

    console.log('Seeded Clean Energy Pioneers with 2 approved posts and 1 pending post.');
    console.log('Seeded Tech Innovations Hub with 1 approved post and 1 pending post.');
    console.log('Communities and Page Posts seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding communities and page posts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

seedCommunitiesAndPages();
