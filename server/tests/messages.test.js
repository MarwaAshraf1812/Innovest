const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Message = require('../db/models/messagesModel'); // Adjust the path to your Message model
require('dotenv').config();

describe('Messages Collection Insert Test', () => {
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

    // Clear the 'messages' collection before each test
    beforeEach(async () => {
        await db.collection('messages').deleteMany({});  // Clear existing documents
    });

    // Test case to insert a message into the 'messages' collection
    it('should insert a message into messages collection', async () => {
        const messagesCollection = db.collection('messages');

        const mockMessage = {
            message_id: 'msg_12345', // String for message ID
            sender_id: 'user_1',      // String for sender ID
            receiver_id: 'user_2',    // String for receiver ID
            content: 'Hello, this is a test message.', // String for message content
            created_at: new Date(),    // Current date
            updated_at: new Date(),     // Current date
        };

        // Insert document without specifying message_id (MongoDB will auto-generate it)
        await messagesCollection.insertOne(mockMessage);

        const insertedMessage = await messagesCollection.findOne({ message_id: mockMessage.message_id });
        expect(insertedMessage).toMatchObject(mockMessage); // Compare fields except _id
    });
});
