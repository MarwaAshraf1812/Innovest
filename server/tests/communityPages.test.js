const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const CommunityPages = require('../db/models/communityPagesModel'); // Adjust the path to your CommunityPages model
require('dotenv').config();

describe('Community Pages Collection Insert Test', () => {
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

  // Clear the 'communitypages' collection before each test
  beforeEach(async () => {
    await db.collection('communitypages').deleteMany({});  // Clear existing documents
  });

  // Test case to insert a document into the 'communitypages' collection
  it('should insert a doc into communitypages collection', async () => {
    const communityPages = db.collection('communitypages');

    const mockCommunityPage = {
      community_name: 'unique-community-name', // String for community name
      created_at: new Date(),                   // Current date
      updated_at: new Date(),                   // Current date
      visibility: true,                         // Visibility flag
      page_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'), // Replace with a valid ObjectId for page
    };

    // Insert document without specifying _id (MongoDB will auto-generate it)
    await communityPages.insertOne(mockCommunityPage);

    const insertedCommunityPage = await communityPages.findOne({ community_name: mockCommunityPage.community_name });
    expect(insertedCommunityPage).toMatchObject(mockCommunityPage);  // Compare fields except _id
  });
});
