const Joi = require('joi');



const createlikeValidationSchema = Joi.object({
  like_id: Joi.string().required(),
  content: Joi.string().min(1).max(500).required(),

  created_at: Joi.date().default(Date.now),

  post_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required()

});


module.exports = { createlikeValidationSchema };