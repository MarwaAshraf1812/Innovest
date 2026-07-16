const Joi = require('joi');

class RegisterUserDTO {
    constructor(data) {
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.role = data.role;
        this.country = data.country;
        this.national_id = data.national_id;
    }
    
    static validationSchema() {
        return Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required() ,
        first_name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        last_name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        phone: Joi.string()
            .min(11)
            .max(13)
            .required(),
        role: Joi.string()
            .min(3)
            .max(30),
        country: Joi.string()
            .min(3)
            .max(30)
            .required(),
        national_id: Joi.string()
            .min(3)
            .max(30)
            .required()
        });
    }
    
    isValid() {
        const { error } = RegisterUserDTO.validationSchema().validate(this);
        return !error;
    }
}

module.exports = RegisterUserDTO ;   