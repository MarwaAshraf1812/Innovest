const Joi = require('joi');

const createcommunityValidationSchema= Joi.object({
    community_name: Joi.string().max(100).required(),
    
    description: Joi.string().required(),
    image: Joi.string().uri().optional(),
    
    admin_id: Joi.string().required(),

});

module.exports = {createcommunityValidationSchema };
