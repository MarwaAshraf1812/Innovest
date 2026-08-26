const Joi = require('joi');

const createCommentValidationSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
});

module.exports = { createCommentValidationSchema };