import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Like Collection Insert Test', () => {
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
    await mongoose.connection.collection('likes').deleteMany({});
  });

  it('should insert a doc into likes collection', async () => {
    const likes = mongoose.connection.collection('likes');

    const mockLike = {
      like_id: 'some-uuid',
      content: 'This is a test like',
      created_at: new Date(),
      user_id: ['some-user-id'],
      post_id: ['some-post-id'],
    };

    await likes.insertOne(mockLike);

    const insertedLike = await likes.findOne({ like_id: 'some-uuid' });
    expect(insertedLike).toMatchObject(mockLike);
  });
});
