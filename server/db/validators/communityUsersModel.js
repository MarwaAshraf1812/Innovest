const Joi = require('joi');

const createcommunityUsersValidationSchema = Joi.object({
    
    visibility: Joi.boolean().default(true),

    created_at: Joi.date().default(Date.now),
    updated_at: Joi.date().default(Date.now),

    community_name: Joi.string().required(),
    user_id: Joi.string().required(),
  });
  
  
  module.exports = { createcommunityUsersValidationSchema };