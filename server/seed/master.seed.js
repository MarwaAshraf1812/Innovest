/**
 * master.seed.js — Extended Platform Seed
 *
 * Wipes all platform data then re-creates:
 *   - 1 Super Admin  +  12 Sub-Admins (Total 13, triggers pagination)
 *   - 20 Users        (15 approved, 5 pending) (Total 20, triggers pagination)
 *   - 12 Communities  (with cover images & tags, triggers pagination)
 *   - Community memberships for approved users
 *   - 20 Page Posts across communities:
 *       · 12 APPROVED  (visible in community feeds)
 *       · 8 PENDING    (sitting in admin review queue)
 *
 * Usage:
 *   node seed/master.seed.js
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { User }        = require('../db/models/userModel');
const Admin           = require('../db/models/adminModel');
const Community       = require('../db/models/communityModel');
const Page            = require('../db/models/pageModel');
const CommunityPages  = require('../db/models/communityPagesModel');
const CommunityUsers  = require('../db/models/communityUsersModel');
const { adminPermissionsEnum, userPermissionsEnum } = require('../db/models/permissionsEnum');

const MONGO_URI = 'mongodb://localhost:27017/Innovest';

/* ─── helpers ──────────────────────────────────────── */
const hash = (pw) => bcrypt.hash(pw, 10);
const uid  = () => uuidv4();

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB');

  /* ── 1. Wipe existing data ─────────────────────── */
  console.log('🧹  Wiping existing collections…');
  await Promise.all([
    Admin.deleteMany({}),
    User.deleteMany({}),
    Community.deleteMany({}),
    Page.deleteMany({}),
    CommunityPages.deleteMany({}),
    CommunityUsers.deleteMany({}),
  ]);

  /* ── 2. Passwords ──────────────────────────────── */
  const [adminPw, subPw, userPw, pendingPw] = await Promise.all([
    hash('admin123'),
    hash('subadmin123'),
    hash('password123'),
    hash('pending123'),
  ]);

  /* ── 3. Admins (13 Total) ──────────────────────── */
  const superAdmin = await new Admin({
    first_name: 'System', last_name: 'Admin',
    username: 'admin', email: 'admin@innovest.co',
    password: adminPw, role: 'SUPER_ADMIN',
    permissions: adminPermissionsEnum, admin_state: 'APPROVER',
  }).save();

  const subAdminData = [
    { first: 'Layla', last: 'Mostafa', user: 'layla_mod', email: 'layla@innovest.co', state: 'APPROVER' },
    { first: 'Karim', last: 'Saad', user: 'karim_mod', email: 'karim@innovest.co', state: 'REJECTOR' },
    { first: 'Hassan', last: 'Ali', user: 'hassan_mod', email: 'hassan@innovest.co', state: 'APPROVER' },
    { first: 'Mona', last: 'Fayed', user: 'mona_mod', email: 'mona@innovest.co', state: 'APPROVER' },
    { first: 'Youssef', last: 'Gaber', user: 'youssef_mod', email: 'youssef_mod@innovest.co', state: 'REJECTOR' },
    { first: 'Sherif', last: 'Amin', user: 'sherif_mod', email: 'sherif@innovest.co', state: 'APPROVER' },
    { first: 'Nour', last: 'Saleh', user: 'nour_mod', email: 'nour_mod@innovest.co', state: 'APPROVER' },
    { first: 'Rania', last: 'Kamal', user: 'rania_mod', email: 'rania@innovest.co', state: 'REJECTOR' },
    { first: 'Tarek', last: 'Soliman', user: 'tarek_mod', email: 'tarek@innovest.co', state: 'APPROVER' },
    { first: 'Yasmin', last: 'Adel', user: 'yasmin_mod', email: 'yasmin@innovest.co', state: 'APPROVER' },
    { first: 'Amr', last: 'Diab', user: 'amr_mod', email: 'amr@innovest.co', state: 'REJECTOR' },
    { first: 'Dina', last: 'El-Sherbiny', user: 'dina_mod', email: 'dina@innovest.co', state: 'APPROVER' },
  ];

  const subAdmins = [];
  for (const item of subAdminData) {
    const sub = await new Admin({
      first_name: item.first, last_name: item.last,
      username: item.user, email: item.email,
      password: subPw, role: 'ADMIN',
      permissions: adminPermissionsEnum, admin_state: item.state,
    }).save();
    subAdmins.push(sub);
  }

  console.log('👑  Admins seeded (13 total)');

  /* ── 4. Approved Users (15 Total) ──────────────── */
  const memberSpecs = [
    { first: 'Omar', last: 'Hassan', user: 'omarhassan', email: 'omar@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'Sarah', last: 'Jenkins', user: 'sarahjenkins', email: 'sarah@example.com', role: 'INVESTOR', country: 'United States' },
    { first: 'Youssef', last: 'Khalil', user: 'youssef_k', email: 'youssef@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'Nour', last: 'El-Din', user: 'nour_invest', email: 'nour@example.com', role: 'INVESTOR', country: 'UAE' },
    { first: 'Khaled', last: 'Mansour', user: 'khaled_m', email: 'khaled@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'John', last: 'Doe', user: 'johndoe', email: 'john@example.com', role: 'INVESTOR', country: 'United Kingdom' },
    { first: 'Fatima', last: 'Zahra', user: 'fatima_z', email: 'fatima@example.com', role: 'ENTREPRENEUR', country: 'Morocco' },
    { first: 'Michael', last: 'Smith', user: 'mikesmith', email: 'mike@example.com', role: 'INVESTOR', country: 'Canada' },
    { first: 'Mariam', last: 'Farid', user: 'mariam_f', email: 'mariam@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'David', last: 'Miller', user: 'davidm', email: 'david@example.com', role: 'INVESTOR', country: 'Germany' },
    { first: 'Salma', last: 'Rashed', user: 'salma_r', email: 'salma@example.com', role: 'ENTREPRENEUR', country: 'Saudi Arabia' },
    { first: 'Robert', last: 'Jones', user: 'robjones', email: 'rob@example.com', role: 'INVESTOR', country: 'United States' },
    { first: 'Aly', last: 'Mahmoud', user: 'aly_m', email: 'aly@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'Elena', last: 'Petrova', user: 'elenap', email: 'elena@example.com', role: 'INVESTOR', country: 'Russia' },
    { first: 'Mostafa', last: 'Kamal', user: 'mostafa_k', email: 'mostafa@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
  ];

  const approvedUsers = [];
  for (let i = 0; i < memberSpecs.length; i++) {
    const spec = memberSpecs[i];
    const u = await new User({
      first_name: spec.first, last_name: spec.last,
      username: spec.user, email: spec.email,
      password: userPw, phone: `0101111223${i}`,
      role: spec.role, country: spec.country,
      is_verified: true, is_active: true, id_nationality: i + 1,
      permissions: userPermissionsEnum,
    }).save();
    approvedUsers.push(u);
  }

  /* ── 5. Pending Users (5 Total) ────────────────── */
  const pendingSpecs = [
    { first: 'Ahmed', last: 'Saber', user: 'ahmed_saber', email: 'ahmed@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'Mia', last: 'Chen', user: 'mia_chen', email: 'mia@example.com', role: 'INVESTOR', country: 'Singapore' },
    { first: 'Hani', last: 'Ramzi', user: 'hani_r', email: 'hani@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
    { first: 'Sonia', last: 'Gomez', user: 'sonia_g', email: 'sonia@example.com', role: 'INVESTOR', country: 'Spain' },
    { first: 'Gamal', last: 'Mubarak', user: 'gamal_m', email: 'gamal@example.com', role: 'ENTREPRENEUR', country: 'Egypt' },
  ];

  const pendingUsers = [];
  for (let i = 0; i < pendingSpecs.length; i++) {
    const spec = pendingSpecs[i];
    const u = await new User({
      first_name: spec.first, last_name: spec.last,
      username: spec.user, email: spec.email,
      password: pendingPw, phone: `0109999887${i}`,
      role: spec.role, country: spec.country,
      is_verified: false, is_active: false, id_nationality: i + 100,
      permissions: [],
    }).save();
    pendingUsers.push(u);
  }

  console.log('👥  Users seeded (15 approved, 5 pending)');

  /* ── 6. Communities (12 Total) ─────────────────── */
  const commData = [
    {
      name: 'Clean Energy Pioneers',
      desc: 'Building the future of bio-fuel, solar grids, wind energy, and clean-tech infrastructure.',
      img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      tags: ['solar', 'biotech', 'clean-tech'],
    },
    {
      name: 'Tech Innovations Hub',
      desc: 'Where robotics engineers, firmware developers, and API architects connect with deep-tech investors.',
      img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      tags: ['software', 'robotics', 'hardware'],
    },
    {
      name: 'HealthTech & MedDevices',
      desc: 'Accelerating medical device startups, digital health platforms, and AI-powered diagnostics.',
      img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      tags: ['healthtech', 'medtech', 'AI'],
    },
    {
      name: 'FinTech & DeFi Circle',
      desc: 'Building next-generation payment rails, decentralized protocols, and retail banking tools.',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      tags: ['fintech', 'blockchain', 'DeFi'],
    },
    {
      name: 'AgriTech & Food Systems',
      desc: 'Smart irrigation, vertical farming ventures, and supply chain tech meeting green capital.',
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      tags: ['agritech', 'sustainability', 'food-tech'],
    },
    {
      name: 'EdTech & Future of Work',
      desc: 'Reimagining primary/secondary learning platforms, corporate upskilling, and hybrid workforce tools.',
      img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
      tags: ['edtech', 'elearning', 'remote-work'],
    },
    {
      name: 'AI & Machine Learning Lab',
      desc: 'Neural networks, computer vision tools, LLM deployment, and predictive modeling roundtables.',
      img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      tags: ['AI', 'deep-learning', 'data-science'],
    },
    {
      name: 'SaaS & Cloud Infrastructure',
      desc: 'B2B subscription platforms, Kubernetes tools, DevOps dashboards, and cybersecurity startups.',
      img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      tags: ['saas', 'cloud', 'devops'],
    },
    {
      name: 'E-commerce & LogiTech',
      desc: 'Last-mile courier routing, warehousing tech, cross-border storefront platforms, and retail tech.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      tags: ['ecommerce', 'logistics', 'delivery'],
    },
    {
      name: 'PropTech & Smart Cities',
      desc: 'Decentralized real-estate investment registries, building efficiency monitoring, and IoT grids.',
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      tags: ['proptech', 'smart-city', 'real-estate'],
    },
    {
      name: 'Creative Economy & Web3',
      desc: 'Direct creator monetization platforms, fractionalized digital assets, and metaverse designs.',
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      tags: ['web3', 'creator-economy', 'NFTs'],
    },
    {
      name: 'Mobility & Micro-Transit',
      desc: 'EV fleet management tools, carpooling systems, autonomous driving stacks, and last-mile electric scooters.',
      img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      tags: ['mobility', 'electric-vehicles', 'transit'],
    },
  ];

  const communities = [];
  for (const c of commData) {
    const comm = await new Community({
      community_id: uid(),
      community_name: c.name,
      description: c.desc,
      image_url: c.img,
      admins: [superAdmin.admin_id],
      tags: c.tags,
      member_count: 0, page_count: 0,
    }).save();
    communities.push(comm);
  }

  console.log('🌍  Communities seeded (12 total)');

  /* ── 7. Memberships (spread across communities) ──── */
  for (let i = 0; i < approvedUsers.length; i++) {
    const user = approvedUsers[i];
    // Each user joins 3 random communities
    const shuffled = [...communities].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, 3);
    for (const comm of targets) {
      await new CommunityUsers({
        user_id: user.id,
        community_id: comm.community_id,
        member_status: 'APPROVED',
        role: 'MEMBER',
      }).save();

      // Add to Community model's users array and increment count
      await Community.findOneAndUpdate(
        { community_id: comm.community_id },
        { $addToSet: { users: user.id }, $inc: { member_count: 1 } }
      );
    }
  }

  console.log('🤝  Community memberships created');

  /* ── 8. Pages (20 Total: 12 approved, 8 pending) ─ */
  const pageSpecs = [
    // APPROVED (12)
    { title: 'Next-Gen Bio-Fuel Grids', content: 'Our micro-algae synthesis loop now produces 3x energy density. €500k seed round open.', type: 'PROJECT_INFO', status: 'APPROVED' },
    { title: 'Vapor API: Robot Arm SDK v2.0', content: 'Unified REST interface for Fanuc/Kuka/ABB arms. Latency sub-12ms.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'AI-Assisted ECG Reading', content: 'ML model matches cardiologist accuracy at 94.2% sensitivity. Clinical trials done.', type: 'PROJECT_INFO', status: 'APPROVED' },
    { title: 'Cross-Border MENA Remittance', content: 'Live beta in Egypt/Jordan/UAE. 0.4% fees vs 4% SWIFT.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'Vertical Hydroponic Farm', content: '400sqm New Cairo facility yields 8x traditional crops with 92% less water.', type: 'PROJECT_INFO', status: 'APPROVED' },
    { title: 'Smart Net Metering Integration', content: 'Raspberry Pi Net Metering module open-sourced on GitHub. Modbus TCP ready.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'LMS for Egyptian K-12', content: 'Adaptive learning system used by 15 schools. Looking for pre-seed funding.', type: 'PROJECT_INFO', status: 'APPROVED' },
    { title: 'Visual Deep Learning Tool', content: 'No-code pipeline creator for PyTorch networks. Live beta online.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'Multi-Tenant SaaS Gateway', content: 'Enterprise authorization gateway supporting RBAC, ABAC and SAML integrations.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'Courier Micro-Routing System', content: 'Dynamic dispatching model reducing last-mile fuel consumption by 18%.', type: 'PROJECT_INFO', status: 'APPROVED' },
    { title: 'Fractional Real-Estate Registry', content: 'On-chain proof of property yields for Egyptian retail investors.', type: 'ARTICLE', status: 'APPROVED' },
    { title: 'EV Fleet Tracker Stack', content: 'Real-time battery diagnostics and route planning for commercial trucks.', type: 'PROJECT_INFO', status: 'APPROVED' },

    // PENDING (8)
    { title: 'Offshore Turbine Supercooling Rings', content: 'Sub-zero cooling rings for offshore wind turbines that boost output by 14%. Awaiting review.', type: 'PROJECT_INFO', status: 'PENDING' },
    { title: 'Autonomous Swarm Drone API', content: 'Testing waypoints for 10 drones in GPS-denied tunnels using UWB tracking.', type: 'POST', status: 'PENDING' },
    { title: 'Non-Invasive Glucose Patch', content: 'Wearable near-infrared spectroscopy patch. validation study inside.', type: 'PROJECT_INFO', status: 'PENDING' },
    { title: 'SME Micro-Insurance API', content: 'Fraud analytics and FRA-compliant micro-insurance SDK for local merchants.', type: 'ARTICLE', status: 'PENDING' },
    { title: 'Delta IoT Moisture Network', content: 'LoRaWAN moisture sensors in Delta farms reducing irrigation water by 35%.', type: 'PROJECT_INFO', status: 'PENDING' },
    { title: 'Gamified Programming for Kids', content: 'Drag-and-drop game engine teaching Python logic to children. Pilot project ready.', type: 'POST', status: 'PENDING' },
    { title: 'Zero-Knowledge Document Locker', content: 'End-to-end encrypted contract signature verification using ZK proofs.', type: 'ARTICLE', status: 'PENDING' },
    { title: 'Modular Solar Inverter Core', content: 'Direct-current high-efficiency converter card for residential solar arrays.', type: 'PROJECT_INFO', status: 'PENDING' },
  ];

  for (let i = 0; i < pageSpecs.length; i++) {
    const spec = pageSpecs[i];
    const pageId = uid();
    // Pick random community
    const targetComm = communities[i % communities.length];
    // Pick random author
    const author = approvedUsers[i % approvedUsers.length];

    await new Page({
      page_id: pageId,
      title: spec.title,
      content: spec.content,
      page_type: spec.type,
      location: 'Cairo, Egypt',
      tags: ['innovest', 'startup', 'seed'],
      author: author.id,
      likes: spec.status === 'APPROVED' ? 10 + i : 0,
      comments: spec.status === 'APPROVED' ? 2 + i : 0,
    }).save();

    await new CommunityPages({
      community_id: targetComm.community_id,
      page_id: pageId,
      page_status: spec.status,
      approved_by: spec.status === 'APPROVED' ? superAdmin.admin_id : undefined,
      visibility: spec.status === 'APPROVED',
    }).save();

    if (spec.status === 'APPROVED') {
      await Community.findOneAndUpdate(
        { community_id: targetComm.community_id },
        { $addToSet: { pages: pageId }, $inc: { page_count: 1 } }
      );
    }
  }

  console.log('📄  Pages seeded (12 approved, 8 pending)');

  // Update member_count for each community
  for (const comm of communities) {
    const count = await CommunityUsers.countDocuments({ community_id: comm.community_id, member_status: 'APPROVED' });
    await Community.findOneAndUpdate({ community_id: comm.community_id }, { $set: { member_count: count } });
  }

  /* ── 9. Summary ────────────────────────────────── */
  console.log('\n═══════════════════════════════════════════════');
  console.log('  🌱  EXTENDED INNOVEST SEED COMPLETE');
  console.log('═══════════════════════════════════════════════');
  console.log('\n📋  LOGIN CREDENTIALS:');
  console.log('  Super Admin   → admin@innovest.co      / admin123');
  console.log('  Sub-Admins    → (use subadmin123 to log into layla@innovest.co etc.)');
  console.log('  Members       → (use password123 to log into omar@example.com etc.)');
  console.log('\n📊  DATA SUMMARY:');
  console.log('  Admins       : 13  (1 super admin, 12 sub-admins)');
  console.log('  Members      : 20  (15 approved, 5 pending)');
  console.log('  Communities  : 12');
  console.log('  Posts        : 20  (12 approved, 8 pending review)');
  console.log('═══════════════════════════════════════════════\n');
}

seed()
  .catch(err => { console.error('❌ Seed failed:', err); process.exit(1); })
  .finally(() => mongoose.disconnect());
