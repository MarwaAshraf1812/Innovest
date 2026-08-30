import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Page Schema Insertion', () => {
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
    await mongoose.connection.collection('pages').deleteMany({});
  });

  it('should insert a Page document into the collection', async () => {
    const pages = mongoose.connection.collection('pages');

    const mockPage = {
      title: 'Sample Page',
      content: 'This is the content of the sample page.',
      location: 'New York, NY',
      images_url: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
      page_url: 'http://example.com/sample-page',
      page_type: 'EVENT',
      admin_state: 'APPROVER',
      page_state: 'PENDING',
      user_id: new mongoose.Types.ObjectId(),
      admin_id: new mongoose.Types.ObjectId(),
      community: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
    };

    await pages.insertOne(mockPage);

    const insertedPage = await pages.findOne({ page_url: 'http://example.com/sample-page' });
    expect(insertedPage).toMatchObject(mockPage);
  });
});
