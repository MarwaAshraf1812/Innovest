import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../db/models/userModel.js';

describe('User Model Test', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create & save a user successfully', async () => {
    const validUser = new User({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe123',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      country: 'USA',
      user_background: 'Software Developer',
      experience: '5 years',
      investment_preferences: ['Tech', 'Healthcare'],
      id_nationality: 1,
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.created_at).toBeDefined();
    expect(savedUser.updated_at).toBeDefined();

    expect(savedUser.first_name).toBe(validUser.first_name);
    expect(savedUser.last_name).toBe(validUser.last_name);
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.user_background).toBe(validUser.user_background);
    expect(savedUser.experience).toBe(validUser.experience);
    expect(savedUser.investment_preferences).toEqual(validUser.investment_preferences);
    expect(savedUser.id_nationality).toBe(validUser.id_nationality);
  });

  it('should not save a user with a duplicate email', async () => {
    const user1 = new User({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe123',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      country: 'USA',
      user_background: 'Software Developer',
      experience: '5 years',
      investment_preferences: ['Tech', 'Healthcare'],
      id_nationality: 1,
    });

    const user2 = new User({
      first_name: 'Jane',
      last_name: 'Doe',
      username: 'janedoe123',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      country: 'USA',
      user_background: 'Data Scientist',
      experience: '3 years',
      investment_preferences: ['Finance'],
      id_nationality: 2,
    });

    await user1.save();

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
  });
});
