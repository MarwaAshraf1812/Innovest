const Joi = require('joi');

const createProposalSchema = Joi.object({
  project_id: Joi.string().required(),
  amount: Joi.number().positive().required(),
  equity_offered: Joi.number().min(0).max(100).required(),
  conditions: Joi.string().allow('').optional(),
  // Ignore any spoofing attempts in body
  investor_id: Joi.string().optional(),
  entrepreneur_id: Joi.string().optional()
});

const counterProposalSchema = Joi.object({
  amount: Joi.number().positive().required(),
  equity_offered: Joi.number().min(0).max(100).required(),
  conditions: Joi.string().allow('').optional(),
  // Ignore any spoofing attempts in body
  investor_id: Joi.string().optional(),
  entrepreneur_id: Joi.string().optional()
});

module.exports = {
  createProposalSchema,
  counterProposalSchema
};
