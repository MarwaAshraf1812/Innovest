const Joi = require('joi');

// Create Document Validation Schema
const createDocumentValidationSchema = Joi.object({
    document_id: Joi.string().hex().length(24).required(),  
    file_name: Joi.string().min(3).max(255).required(),      
    file_url: Joi.string().uri().required(),                 
    project_id: Joi.string().hex().length(24).required(),    
    created_at: Joi.date().optional(),                     
});
const updateDocumentValidationSchema = Joi.object({
    document_id: Joi.string().hex().length(24).optional(),  
    file_name: Joi.string().min(3).max(255).optional(),      
    file_url: Joi.string().uri().optional(),                 
    project_id: Joi.string().hex().length(24).optional(),    
    updated_at: Joi.date().optional(),                     
});

module.exports = { createDocumentValidationSchema , updateDocumentValidationSchema };

