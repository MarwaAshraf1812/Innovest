import Joi from 'joi';

// Create Message Validation Schema
export const createMessageValidationSchema = Joi.object({
  message_id: Joi.string().optional(), 
  sender_id: Joi.string().optional(),   
  receiver_id: Joi.string().required(), 
  content: Joi.string().min(1).required(), 
  created_at: Joi.date().optional(),   
  updated_at: Joi.date().optional()      
});

// Update Message Validation Schema
export const updateMessageValidationSchema = Joi.object({
  message_id: Joi.string().optional(), 
  sender_id: Joi.string().optional(),   
  receiver_id: Joi.string().optional(), 
  content: Joi.string().min(1).optional(), 
  updated_at: Joi.date().optional(),    
});

export default { createMessageValidationSchema, updateMessageValidationSchema };
