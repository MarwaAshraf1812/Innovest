import Joi from 'joi';

export const createFeedbackValidationSchema = Joi.object({
  rate: Joi.number().min(0).max(5).optional(),
  content: Joi.string().required(),
  user_id: Joi.string().hex().length(24).required(),
  project_id: Joi.string().hex().length(24).required(),
  feedbacker_id: Joi.string().hex().length(24).optional()
});

export const updateFeedbackValidationSchema = Joi.object({
  rate: Joi.number().min(0).max(5).optional(),
  content: Joi.string().optional(),
  user_id: Joi.string().hex().length(24).optional(),
  project_id: Joi.string().hex().length(24).optional(),
  feedbacker_id: Joi.string().hex().length(24).optional()
});

export default {
  createFeedbackValidationSchema,
  updateFeedbackValidationSchema
};
