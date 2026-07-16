// const { MongoClient } = require('mongodb');
// const mongoose = require('mongoose');
// const Project = require('../db/models/projectModel'); // Adjust the path to your Project model
// require('dotenv').config();

// describe('Projects Collection Insert Test', () => {
//     let db;
//     let client;

//     beforeAll(async () => {
//         // MongoDB native connection using your database "Innovest" on localhost
//         const uri = 'mongodb://localhost:27017'; // Local URI
//         client = await MongoClient.connect(uri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         db = await client.db('Innovest'); // Connect to the "Innovest" database

//         // Mongoose connection to the same URI and database
//         await mongoose.connect(uri + '/Innovest', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     });

//     afterAll(async () => {
//         if (client) {
//             await client.close(); // Close MongoClient connection
//         }
//         if (mongoose.connection) {
//             await mongoose.connection.close(); // Close Mongoose connection
//         }
//     });

//     // Clear the 'projects' collection before each test
//     beforeEach(async () => {
//         await db.collection('projects').deleteMany({});  // Clear existing documents
//     });

//     // Test case to insert a project into the 'projects' collection
//     it('should insert a project into projects collection', async () => {
//         const projectsCollection = db.collection('projects');

//         const mockProject = {
//             project_id: 'proj_001',             // String for project ID
//             entrepreneur_id: 'user_1',           // String for entrepreneur ID
//             project_name: 'Innovative Tech',      // String for project name
//             description: 'A project to innovate.', // String for project description
//             status: 'Pending',                    // String for project status
//             visibility: true,                     // Boolean for project visibility
//             field: 'Technology',                  // String for project field
//             budget: 50000.00,                    // Float for budget amount
//             offer: 45000.00,                     // Float for offer amount
//             target: 100000.00,                   // Float for target amount
//             deadline: '2024-12-31',              // String for project deadline
//             created_at: new Date(),              // Current date
//             updated_at: new Date(),               // Current date
//         };

//         // Insert document without specifying project_id (MongoDB will auto-generate it)
//         await projectsCollection.insertOne(mockProject);

//         const insertedProject = await projectsCollection.findOne({ project_id: mockProject.project_id });
//         expect(insertedProject).toMatchObject(mockProject); // Compare fields except _id
//     });
// });

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Project = require('../db/models/projectModel'); // Adjust the path to your Project model

describe('Project Schema Insertion', () => {
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

  it('should insert a Project document into the collection', async () => {
    const projects = db.collection('projects'); // Access the projects collection

    // Mock data to fit the Project schema
    const mockProject = {
      project_id: 'sample-project-id',
      project_name: 'Sample Project',
      description: 'This is the description of the sample project.',
      entrepreneur_id: new mongoose.Types.ObjectId(), // Mock ObjectId for the entrepreneur
      status: 'under review',
      visibility: true,
      field: 'Technology',
      budget: 100000,
      offer: 80000,
      target: 120000,
      deadline: '2024-12-31',
      documents: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()] // Mock ObjectId for documents
    };

    // Insert document
    await projects.insertOne(mockProject);

    // Find and assert the inserted document
    const insertedProject = await projects.findOne({ project_id: 'sample-project-id' });
    expect(insertedProject).toMatchObject(mockProject);  // Check that the document matches the mock data
  });
});
