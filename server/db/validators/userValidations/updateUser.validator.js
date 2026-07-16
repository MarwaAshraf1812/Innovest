const Joi = require('joi');

const updateUserValidationSchema = Joi.object({
  first_name: Joi.string().max(30).optional(),
  last_name: Joi.string().max(30).optional(),
  username: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.string().max(15).optional(),
  role: Joi.string().valid('ENTREPRENEUR', 'INVESTOR', 'ADMIN').optional(),
  country: Joi.string().optional(),
  user_background: Joi.string().optional(),
  experience: Joi.string().optional(),
  id_nationality: Joi.number().optional(),
  id_document: Joi.string().optional(),
  profile_image: Joi.string().uri().optional(),
  is_verified: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  investment_preferences: Joi.array().items(Joi.string()).optional(),
  user_languages: Joi.array().items(Joi.string()).optional(),
  user_interests: Joi.array().items(Joi.string()).optional(),
});

module.exports = { updateUserValidationSchema };
