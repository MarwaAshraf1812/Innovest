const Joi = require('joi');

const createUserValidationSchema = Joi.object({
  first_name: Joi.string().max(30).required(),
  last_name: Joi.string().max(30).required(),
  username: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().max(15).optional(),
  role: Joi.string().valid('ENTREPRENEUR', 'INVESTOR', 'ADMIN').default('ENTREPRENEUR'),
  country: Joi.string().optional(),
  user_background: Joi.string().optional(),
  experience: Joi.string().optional(),
  id_nationality: Joi.number().optional(),
  id_document: Joi.string().optional(),
  profile_image: Joi.string().uri().default('https://i.ibb.co/6WtQfMm/default.png'),
  is_verified: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
  investment_preferences: Joi.array().items(Joi.string()).optional(),
  user_languages: Joi.array().items(Joi.string()).optional(),
  user_interests: Joi.array().items(Joi.string()).optional(), 
});

module.exports = { createUserValidationSchema };
