const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Project = require('../db/models/projectModel');

describe('Project Schema Insertion', () => {
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
    await mongoose.connection.collection('projects').deleteMany({});
  });

  it('should insert a Project document into the collection', async () => {
    const projects = mongoose.connection.collection('projects');

    const mockProject = {
      project_id: 'sample-project-id',
      project_name: 'Sample Project',
      description: 'This is the description of the sample project.',
      entrepreneur_id: new mongoose.Types.ObjectId(),
      status: 'under review',
      visibility: true,
      field: 'Technology',
      budget: 100000,
      offer: 80000,
      target: 120000,
      deadline: '2024-12-31',
      documents: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
    };

    await projects.insertOne(mockProject);

    const insertedProject = await projects.findOne({ project_id: 'sample-project-id' });
    expect(insertedProject).toMatchObject(mockProject);
  });
});
