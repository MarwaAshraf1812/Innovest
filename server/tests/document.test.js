const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Document = require('../db/models/documentModel'); // Adjust the path to your Document model
require('dotenv').config();

describe('Documents Collection Insert Test', () => {
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

    // Clear the 'documents' collection before each test
    beforeEach(async () => {
        await db.collection('documents').deleteMany({});  // Clear existing documents
    });

    // Test case to insert a document into the 'documents' collection
    it('should insert a doc into documents collection', async () => {
        const documentsCollection = db.collection('documents');

        const mockDocument = {
            file_name: 'example_document.pdf', // String for file name
            file_url: 'http://example.com/example_document.pdf', // String for file URL
            project_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'), // Replace with a valid ObjectId for project
            created_at: new Date(), // Current date
            updated_at: new Date(), // Current date
        };

        // Insert document without specifying document_id (MongoDB will auto-generate it)
        await documentsCollection.insertOne(mockDocument);

        const insertedDocument = await documentsCollection.findOne({ file_name: mockDocument.file_name });
        expect(insertedDocument).toMatchObject(mockDocument); // Compare fields except _id
    });
});
