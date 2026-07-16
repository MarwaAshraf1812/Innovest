const Joi = require('joi');


const createNotivicationValidationSchema= Joi.object({
    notification_id: Joi.string().hex().length(24).required(), 
    content:Joi.string().required(),
    type:Joi.string().hex().length(24).required(),  
    read_statu: Joi.boolean().truthy('Y'),
    user_id: Joi.string().hex().length(24).optional()
});


module.exports = {createNotivicationValidationSchema };
