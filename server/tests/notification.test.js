const mongoose = require('mongoose');
const Notification = require('../db/models/notificationModel');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Notification Model Test', () => {
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
    await Notification.deleteMany({});
  });

  it('should insert a notification into the collection', async () => {
    const mockNotification = {
      user_id: 'user_123',
      type: 'Investment Update',
      data: { content: 'Your investment has been approved.' },
      read: false,
    };

    await Notification.create(mockNotification);
    const insertedNotification = await Notification.findOne({ type: 'Investment Update' });

    expect(insertedNotification).toBeDefined();
    expect(insertedNotification.type).toBe(mockNotification.type);
    expect(insertedNotification.read).toBe(mockNotification.read);
    expect(insertedNotification.data.content).toBe(mockNotification.data.content);
  });

  it('should not save a notification without required fields', async () => {
    const mockNotification = {
      data: { content: 'Test content' },
      read: false,
    };

    let error = null;
    try {
      await Notification.create(mockNotification);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.type).toBeDefined();
    expect(error.errors.user_id).toBeDefined();
  });
});
