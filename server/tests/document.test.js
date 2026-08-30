import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Documents Collection Insert Test', () => {
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
    await mongoose.connection.collection('documents').deleteMany({});
  });

  it('should insert a doc into documents collection', async () => {
    const documentsCollection = mongoose.connection.collection('documents');

    const mockDocument = {
      file_name: 'example_document.pdf',
      file_url: 'http://example.com/example_document.pdf',
      project_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
      created_at: new Date(),
      updated_at: new Date(),
    };

    await documentsCollection.insertOne(mockDocument);

    const insertedDocument = await documentsCollection.findOne({ file_name: mockDocument.file_name });
    expect(insertedDocument).toMatchObject(mockDocument);
  });
});
