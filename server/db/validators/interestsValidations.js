import Joi from 'joi';

export const createInterestValidationSchema = Joi.object({
  name: Joi.string().max(50).required(),
  admin_id: Joi.string().required(),
  users: Joi.array().items(Joi.string()).optional(),
});

export const updateInterestValidationSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  admin_id: Joi.string().optional(),
  users: Joi.array().items(Joi.string()).optional(),
});

export default {
  createInterestValidationSchema,
  updateInterestValidationSchema
};
