const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Investment = require('../db/models/investmentModel'); // Adjust the path to your Investment model
require('dotenv').config();

describe('Investments Collection Insert Test', () => {
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

    // Clear the 'investments' collection before each test
    beforeEach(async () => {
        await db.collection('investments').deleteMany({});  // Clear existing documents
    });

    // Test case to insert an investment into the 'investments' collection
    it('should insert an investment into investments collection', async () => {
        const investmentsCollection = db.collection('investments');

        const mockInvestment = {
            invest_id: 1,                           // Integer for investment ID
            created_at: new Date(),                 // Current date
            budget_amount: 50000.00,                // Float for budget amount
            name: 'Seed Funding',                    // String for investment name
            investor_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'), // Replace with a valid ObjectId for investor
            project_id: new mongoose.Types.ObjectId('507f191e810c19729de860eb'),  // Replace with a valid ObjectId for project
        };

        // Insert document without specifying invest_id (MongoDB will auto-generate it)
        await investmentsCollection.insertOne(mockInvestment);

        const insertedInvestment = await investmentsCollection.findOne({ invest_id: mockInvestment.invest_id });
        expect(insertedInvestment).toMatchObject(mockInvestment); // Compare fields except _id
    });
});
