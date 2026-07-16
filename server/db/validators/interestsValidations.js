const Joi = require('joi');

const createInterestValidationSchema = Joi.object({
  name: Joi.string().max(50).required(),
  admin_id: Joi.string().required(),
  users: Joi.array().items(Joi.string()).optional(),
});

const updateInterestValidationSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  admin_id: Joi.string().optional(),
  users: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  createInterestValidationSchema,
  updateInterestValidationSchema
};
