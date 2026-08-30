import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../db/models/userModel.js';
import Admin from '../db/models/adminModel.js';
import dotenv from 'dotenv';
import { adminPermissionsEnum } from '../db/models/permissionsEnum.js';

dotenv.config();

// Use the database name with a capital 'I' as already initialized on disk
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Innovest';

async function seedUsers() {
  try {
    console.log('Connecting to database:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    // Passwords to hash
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const entrepreneurPasswordHash = await bcrypt.hash('password123', 10);
    const investorPasswordHash = await bcrypt.hash('investor123', 10);

    // 1. Clean up existing seed users
    console.log('Cleaning up existing seed records...');
    await Admin.deleteOne({ username: 'admin' });
    await User.deleteMany({ username: { $in: ['omarhassan', 'sarahjenkins'] } });

    // 2. Seed Admin User
    const newAdmin = new Admin({
      first_name: 'System',
      last_name: 'Admin',
      username: 'admin',
      email: 'admin@innovest.co',
      password: adminPasswordHash,
      role: 'ADMIN',
      permissions: adminPermissionsEnum,
      admin_state: 'APPROVER'
    });
    await newAdmin.save();
    console.log('Seeded Admin: admin@innovest.co / admin123');

    // 3. Seed Entrepreneur User (APPROVED / VERIFIED)
    const newEntrepreneur = new User({
      first_name: 'Omar',
      last_name: 'Hassan',
      username: 'omarhassan',
      email: 'omar@example.com',
      password: entrepreneurPasswordHash,
      phone: '01023456789',
      role: 'ENTREPRENEUR',
      country: 'Egypt',
      is_verified: true,
      is_active: true,
      id_nationality: 1,
      permissions: ['UPDATE_USER', 'VIEW_USER', 'DELETE_USER', 'JOIN_COMMUNITY']
    });
    await newEntrepreneur.save();
    console.log('Seeded Entrepreneur (Verified): omar@example.com / password123');

    // 4. Seed Investor User (APPROVED / VERIFIED)
    const newInvestor = new User({
      first_name: 'Sarah',
      last_name: 'Jenkins',
      username: 'sarahjenkins',
      email: 'sarah@example.com',
      password: investorPasswordHash,
      phone: '01198765432',
      role: 'INVESTOR',
      country: 'Egypt',
      is_verified: true,
      is_active: true,
      id_nationality: 2,
      permissions: ['UPDATE_USER', 'VIEW_USER', 'DELETE_USER', 'JOIN_COMMUNITY']
    });
    await newInvestor.save();
    console.log('Seeded Investor (Verified): sarah@example.com / investor123');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

seedUsers();
