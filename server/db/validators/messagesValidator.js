const Joi = require('joi');

// Create Message Validation Schema
const createMessageValidationSchema = Joi.object({
    message_id: Joi.string().required(), 
    sender_id: Joi.string().required(),   
    receiver_id: Joi.string().required(), 
    content: Joi.string().min(1).required(), 
    created_at: Joi.date().optional(),   
    updated_at: Joi.date().optional()      
});

// Update Message Validation Schema
const updateMessageValidationSchema = Joi.object({
    message_id: Joi.string().required(), 
    sender_id: Joi.string().optional(),   
    receiver_id: Joi.string().optional(), 
    content: Joi.string().min(1).optional(), 
    updated_at: Joi.date().optional(),    
});

module.exports = { createMessageValidationSchema , updateMessageValidationSchema };
