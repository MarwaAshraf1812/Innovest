const Joi = require('joi');

// Define the validation schema for a project
const projectValidationSchema = Joi.object({
  project_name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  entrepreneur_id: Joi.string().required(), 
  status: Joi.string().valid('under review', 'funded', 'funding').default('under review'),
  visibility: Joi.boolean().default(true),
  field: Joi.string().min(3).max(100).required(),
  budget: Joi.number().min(0).required(),
  offer: Joi.number().min(0),
  target: Joi.number().min(0),
  deadline: Joi.string().required(), 
  documents: Joi.array().items(Joi.string()) 
});

const projectUpdateValidationSchema = Joi.object({
    project_name: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    entrepreneur_id: Joi.string(), 
    status: Joi.string().valid('under review', 'funded', 'funding'),
    visibility: Joi.boolean(),
    field: Joi.string().min(3).max(100),
    budget: Joi.number().min(0),
    offer: Joi.number().min(0),
    target: Joi.number().min(0),
    deadline: Joi.string(), 
    documents: Joi.array().items(Joi.string()) 
  });

  module.exports = { projectValidationSchema , projectUpdateValidationSchema };
  