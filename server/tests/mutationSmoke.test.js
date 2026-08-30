import { createUserValidationSchema } from '../db/validators/userValidations/createUser.validator.js';
import { projectValidationSchema, projectUpdateValidationSchema } from '../db/validators/projectValidator.js';
import { createcommunityValidationSchema } from '../db/validators/communityValidator.js';
import { createMessageValidationSchema } from '../db/validators/messagesValidator.js';

describe('Mutation Routes Payload Smoke Tests (Frontend Shapes)', () => {
  it('1. User Registration payload matching frontend useRegisterForm', () => {
    const frontendUserPayload = {
      first_name: 'Sarah',
      last_name: 'Abdullah',
      username: 'sarah_a12',
      email: 'sarah.abdullah@example.com',
      password: 'securepassword123',
      phone: '01032632025',
      role: 'ENTREPRENEUR',
      country: 'Egypt',
      national_id: '12345456885'
    };

    const { error } = createUserValidationSchema.validate(frontendUserPayload);
    expect(error).toBeUndefined();
  });

  it('2. Project Create payload matching frontend useEntrepreneurPitches', () => {
    const frontendProjectCreatePayload = {
      project_name: 'EcoEnergy Solution',
      description: 'A renewable energy startup focused on solar integration.',
      field: 'Fintech',
      budget: 50000,
      deadline: '2026-12-31',
      offer: 10000,
      target: 50000
    };

    const { error } = projectValidationSchema.validate(frontendProjectCreatePayload);
    expect(error).toBeUndefined();
  });

  it('3. Project Update payload matching frontend useEntrepreneurPitches', () => {
    const frontendProjectUpdatePayload = {
      project_name: 'EcoEnergy Solution Updated',
      description: 'An updated description for renewable energy startup.',
      field: 'CleanTech',
      budget: 60000,
      deadline: '2026-12-31',
      offer: 15000,
      target: 60000
    };

    const { error } = projectUpdateValidationSchema.validate(frontendProjectUpdatePayload);
    expect(error).toBeUndefined();
  });

  it('4. Community Create payload matching frontend useCreateEntity', () => {
    const frontendCommunityPayload = {
      community_name: 'Green Energy Innovators',
      description: 'Community for sustainable and renewable energy startups.',
      image_url: 'https://i.ibb.co/6WtQfMm/default.png',
      tags: ['green', 'clean-energy']
    };

    const { error } = createcommunityValidationSchema.validate(frontendCommunityPayload);
    expect(error).toBeUndefined();
  });

  it('5. Message Send payload matching frontend chatService', () => {
    const frontendMessagePayload = {
      receiver_id: '507f1f77bcf86cd799439011',
      content: 'Hello, I am interested in discussing your startup proposal.'
    };

    const { error } = createMessageValidationSchema.validate(frontendMessagePayload);
    expect(error).toBeUndefined();
  });
});
