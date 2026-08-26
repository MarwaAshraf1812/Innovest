const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Messages Collection Insert Test', () => {
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
    await mongoose.connection.collection('messages').deleteMany({});
  });

  it('should insert a message into messages collection', async () => {
    const messagesCollection = mongoose.connection.collection('messages');

    const mockMessage = {
      message_id: 'msg_12345',
      sender_id: 'user_1',
      receiver_id: 'user_2',
      content: 'Hello, this is a test message.',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await messagesCollection.insertOne(mockMessage);

    const insertedMessage = await messagesCollection.findOne({ message_id: mockMessage.message_id });
    expect(insertedMessage).toMatchObject(mockMessage);
  });
});
