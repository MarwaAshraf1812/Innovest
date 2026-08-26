const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Community Collection Insert Test', () => {
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

  beforeEach(async () => {
    await mongoose.connection.collection('communities').deleteMany({});
  });

  it('should insert a doc into communities collection', async () => {
    const communities = mongoose.connection.collection('communities');

    const mockCommunity = {
      name: 'Tech Innovators',
      description: 'A community for tech enthusiasts',
      admin_id: 'some-admin-id',
      users: [],
      pages: [],
      created_at: new Date(),
      updated_at: new Date(),
      image: 'community.jpg'
    };

    await communities.insertOne(mockCommunity);

    const insertedCommunity = await communities.findOne({ name: 'Tech Innovators' });
    expect(insertedCommunity).toMatchObject(mockCommunity);
  });
});
