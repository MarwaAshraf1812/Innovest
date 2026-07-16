const Joi = require('joi');

const adminValidationSchema = Joi.object({
    first_name: Joi.string()
        .min(2)
        .max(30)
        .messages({
            'string.base': `"first_name" should be a type of 'text'`,
            'string.empty': `"first_name" cannot be an empty field`,
            'string.min': `"first_name" should have a minimum length of {#limit}`,
            'any.required': `"first_name" is a required field`
        }),
    
    last_name: Joi.string()
        .min(2)
        .max(30)
        .messages({
            'string.base': `"last_name" should be a type of 'text'`,
            'string.empty': `"last_name" cannot be an empty field`,
            'string.min': `"last_name" should have a minimum length of {#limit}`,
            'any.required': `"last_name" is a required field`
        }),
    
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `"username" should be a type of 'text'`,
            'string.empty': `"username" cannot be an empty field`,
            'string.alphanum': `"username" must only contain alphanumeric characters`,
            'string.min': `"username" should have a minimum length of {#limit}`,
            'any.required': `"username" is a required field`
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': `"email" should be a type of 'text'`,
            'string.email': `"email" must be a valid email`,
            'string.empty': `"email" cannot be an empty field`,
            'any.required': `"email" is a required field`
        }),
    
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': `"password" should be a type of 'text'`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of {#limit}`,
            'any.required': `"password" is a required field`
        }),
    
    role: Joi.string()
        .valid('ADMIN', 'SUPER_ADMIN')
        .default('ADMIN'),

    profile_image: Joi.string()
        .default('https://res.cloudinary.com/djvjxp2am/image/upload/v1628684396/avatars/avatar-1_ymq8zg.png'),
    
    permissions: Joi.array()
        .items(Joi.string())
        .default([]),
});

module.exports = adminValidationSchema;
