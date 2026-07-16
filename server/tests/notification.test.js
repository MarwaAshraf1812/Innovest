const mongoose = require('mongoose');
const Notification = require('../db/models/notificationModel'); // Replace with the correct path to your notification model
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Notification Model Test', () => {
  let mongoServer;
  let connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear the database after each test
    await Notification.deleteMany({});
  });

  it('should insert a notification into the collection', async () => {
    const mockNotification = {
      content: 'Your investment has been approved.',
      type: 'Investment Update',
      read_status: false,
      user_id: new mongoose.Types.ObjectId(), // Replace with a valid user ObjectId if necessary
    };

    await Notification.create(mockNotification);
    const insertedNotification = await Notification.findOne({ content: 'Your investment has been approved.' });

    expect(insertedNotification).toBeDefined();
    expect(insertedNotification.type).toBe(mockNotification.type);
    expect(insertedNotification.read_status).toBe(mockNotification.read_status);
  });

  it('should not save a notification without required fields', async () => {
    const mockNotification = {
      type: 'Investment Update',
      read_status: false,
    };

    let error = null;
    try {
      await Notification.create(mockNotification);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.content).toBeDefined();
    expect(error.errors.user_id).toBeDefined();
  });
});
