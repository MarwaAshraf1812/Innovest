const Joi = require('joi');

class RegisterDTO {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    
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
        .required()
    });
  }

  isValid() {
    const { error } = RegisterDTO.validationSchema().validate(this);
    return !error;
  }
}

module.exports = RegisterDTO;
