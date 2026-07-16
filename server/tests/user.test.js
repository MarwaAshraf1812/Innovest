const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User } = require('../db/models/userModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear the database after each test
  await User.deleteMany({});
});

describe('User Model Test', () => {
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

    // ObjectId and timestamps should be defined when successfully saved
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
      email: 'johndoe@example.com', // Same email to trigger duplicate error
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
      console.log("Caught error:", error);
    }

    // Assertions
    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.kind).toBe('unique');
    expect(err.errors.email.path).toBe('email');
    expect(err.errors.email.value).toBe('johndoe@example.com');
  });
});
