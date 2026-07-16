const Joi = require('joi');



const commentValidationSchema = Joi.object({
  comment_id: Joi.string().required(),
  content: Joi.string().min(1).max(500).required(),

  created_at: Joi.date().default(Date.now),

  post_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required()

});

const validateComment = (commentData) => {
  const { error, value } = commentValidationSchema.validate(commentData, { abortEarly: false });   //return all errors 
  
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return { isValid: false, errors: errorMessages };   //get the first validation error 
  }
  return { isValid: true, value };
};



module.exports = { commentValidationSchema ,validateComment};