const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const UserService = require('../services/user_auth.service');
const { User } = require('../db/models/userModel');
const crypto = require('crypto');

describe('Refresh Token Invalidation & Security Test', () => {
  let mongoServer;

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'test_secret_key_123';
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

  it('should store hashed refresh token on login and invalidate after logout', async () => {
    const user = new User({
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      is_verified: true,
      phone: '0101234567'
    });
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash('password123', 10);
    await user.save();

    // 1. Perform login
    const loginResult = await UserService.login('test@example.com', 'password123');
    expect(loginResult.token).toBeDefined();
    expect(loginResult.refreshToken).toBeDefined();

    // Verify refresh token is stored hashed in DB
    const dbUser = await User.findOne({ email: 'test@example.com' });
    const expectedHash = crypto.createHash('sha256').update(loginResult.refreshToken).digest('hex');
    expect(dbUser.refresh_token).toBe(expectedHash);

    // 2. Test refresh token exchange works
    const refreshed = await UserService.refreshAccessToken(loginResult.refreshToken);
    expect(refreshed.token).toBeDefined();

    // 3. Invalidate (logout / revoke)
    await UserService.revokeRefreshToken(dbUser.id);

    // 4. Try reusing old refresh token against /refresh-token -> must fail
    await expect(UserService.refreshAccessToken(loginResult.refreshToken)).rejects.toThrow('Invalid or expired refresh token');
  });
});
