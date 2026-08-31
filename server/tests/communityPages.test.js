import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Community Pages Collection Insert Test', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.collection('communitypages').deleteMany({});
  });

  it('should insert a doc into communitypages collection', async () => {
    const communityPages = mongoose.connection.collection('communitypages');

    const mockCommunityPage = {
      community_name: 'unique-community-name',
      created_at: new Date(),
      updated_at: new Date(),
      visibility: true,
      page_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
    };

    await communityPages.insertOne(mockCommunityPage);

    const insertedCommunityPage = await communityPages.findOne({ community_name: mockCommunityPage.community_name });
    expect(insertedCommunityPage).toMatchObject(mockCommunityPage);
  });
});
