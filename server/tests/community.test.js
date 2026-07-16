const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Community = require('../db/models/communityModel');
require('dotenv').config();

// const { MongoClient } = require('mongodb');

describe('Community Collection Insert Test', () => {
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

  
  // Clear the 'communities' collection before each test
  beforeEach(async () => {
    await db.collection('communities').deleteMany({});  // Clear existing documents
  });

  // Test case to insert a document into the 'communities' collection
  it('should insert a doc into communities collection', async () => {
    const communities = db.collection('communities');

    const mockCommunity = {
      name: 'Tech Innovators',
      description: 'A community for tech enthusiasts',
      admin_id: 'some-admin-id',  // Replace with ObjectId in a real scenario
      users: [],
      pages: [],
      created_at: new Date(),
      updated_at: new Date(),
      image: 'community.jpg'
    };

    // Insert document without specifying _id (MongoDB will auto-generate it)
    await communities.insertOne(mockCommunity);

    const insertedCommunity = await communities.findOne({ name: 'Tech Innovators' });
    expect(insertedCommunity).toMatchObject(mockCommunity);  // Compare fields except _id
  });
});






