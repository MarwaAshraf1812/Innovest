import Joi from 'joi';

export const createCommentValidationSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
});

export default { createCommentValidationSchema };