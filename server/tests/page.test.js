
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Page = require('../db/models/pageModel'); 

describe('Page Schema Insertion', () => {
  let client;  // MongoClient connection
  let db;

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

  it('should insert a Page document into the collection', async () => {
    const pages = db.collection('pages');

    // Mock data to fit the Page schema
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

    // Insert document
    await pages.insertOne(mockPage);

    // Find and assert the inserted document
    const insertedPage = await pages.findOne({ page_url: 'http://example.com/sample-page' });
    expect(insertedPage).toMatchObject(mockPage);  // Check that the document matches the mock data
  });
});


   
