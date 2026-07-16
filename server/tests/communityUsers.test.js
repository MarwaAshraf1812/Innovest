const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const CommunityUsers = require('../db/models/communityUsersModel'); // Adjust the path to your CommunityUsers model
require('dotenv').config();

describe('Community Users Collection Insert Test', () => {
  let connection;
  let db;
  let client;

  beforeAll(async () => {
    // MongoDB native connection using your database "Innovest" on localhost
    const uri = 'mongodb://localhost:27017'; // Local URI
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await client.db('Innovest'); // Connect to the "Innovest" database

    // Mongoose connection to the same URI and database
    await mongoose.connect(uri + '/Innovest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    if (client) {
      await client.close(); // Close MongoClient connection
    }
    if (mongoose.connection) {
      await mongoose.connection.close(); // Close Mongoose connection
    }
  });

  // Clear the 'communityusers' collection before each test
  beforeEach(async () => {
    await db.collection('communityusers').deleteMany({});  // Clear existing documents
  });

  // Test case to insert a document into the 'communityusers' collection
  it('should insert a doc into communityusers collection', async () => {
    const communityUsers = db.collection('communityusers');

    const mockCommunityUser = {
      visibility: true,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: [new mongoose.Types.ObjectId('507f191e810c19729de860ea')],  // Replace with a valid ObjectId
      community_name: [new mongoose.Types.ObjectId('507f191e810c19729de860eb')],  // Replace with a valid ObjectId
    };

    // Insert document without specifying _id (MongoDB will auto-generate it)
    await communityUsers.insertOne(mockCommunityUser);

    const insertedCommunityUser = await communityUsers.findOne({ user_id: mockCommunityUser.user_id });
    expect(insertedCommunityUser).toMatchObject(mockCommunityUser);  // Compare fields except _id
  });
});
