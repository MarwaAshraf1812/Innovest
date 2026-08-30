import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Investments Collection Insert Test', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.collection('investments').deleteMany({});
  });

  it('should insert an investment into investments collection', async () => {
    const investmentsCollection = mongoose.connection.collection('investments');

    const mockInvestment = {
      invest_id: 1,
      created_at: new Date(),
      budget_amount: 50000.00,
      name: 'Seed Funding',
      investor_id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
      project_id: new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
    };

    await investmentsCollection.insertOne(mockInvestment);

    const insertedInvestment = await investmentsCollection.findOne({ invest_id: mockInvestment.invest_id });
    expect(insertedInvestment).toMatchObject(mockInvestment);
  });
});
