import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Comment Collection Insert Test', () => {
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
    await mongoose.connection.collection('comments').deleteMany({});
  });

  it('should insert a doc into comments collection', async () => {
    const comments = mongoose.connection.collection('comments');

    const mockComment = {
      comment_id: 'some-uuid',
      content: 'This is a test comment',
      created_at: new Date(),
      user_id: ['some-user-id'],
      post_id: ['some-post-id'],
    };

    await comments.insertOne(mockComment);

    const insertedComment = await comments.findOne({ comment_id: 'some-uuid' });
    expect(insertedComment).toMatchObject(mockComment);
  });
});
