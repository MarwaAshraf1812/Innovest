import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Community Users Collection Insert Test', () => {
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
    await mongoose.connection.collection('communityusers').deleteMany({});
  });

  it('should insert a doc into communityusers collection', async () => {
    const communityUsers = mongoose.connection.collection('communityusers');

    const mockCommunityUser = {
      visibility: true,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: [new mongoose.Types.ObjectId('507f191e810c19729de860ea')],
      community_name: [new mongoose.Types.ObjectId('507f191e810c19729de860eb')],
    };

    await communityUsers.insertOne(mockCommunityUser);

    const insertedCommunityUser = await communityUsers.findOne({ user_id: mockCommunityUser.user_id });
    expect(insertedCommunityUser).toMatchObject(mockCommunityUser);
  });
});
