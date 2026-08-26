const Joi = require('joi');

// Define the validation schema for a project
const projectValidationSchema = Joi.object({
  project_name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  entrepreneur_id: Joi.string().optional(), 
  status: Joi.string().valid('under review', 'funded', 'funding').default('under review'),
  visibility: Joi.boolean().default(true),
  field: Joi.string().min(3).max(100).required(),
  budget: Joi.number().min(0).required(),
  offer: Joi.number().min(0).optional().allow(null),
  target: Joi.number().min(0).optional().allow(null),
  deadline: Joi.string().required(), 
  documents: Joi.array().items(Joi.string()).optional()
});

const projectUpdateValidationSchema = Joi.object({
  project_name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  entrepreneur_id: Joi.string().optional(), 
  status: Joi.string().valid('under review', 'funded', 'funding').optional(),
  visibility: Joi.boolean().optional(),
  field: Joi.string().min(3).max(100).optional(),
  budget: Joi.number().min(0).optional(),
  offer: Joi.number().min(0).optional().allow(null),
  target: Joi.number().min(0).optional().allow(null),
  deadline: Joi.string().optional(), 
  documents: Joi.array().items(Joi.string()).optional()
});

module.exports = { projectValidationSchema, projectUpdateValidationSchema };