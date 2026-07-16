const Joi = require('joi');

class LoginDTO {
  constructor(username_or_email, password) {
    this.username_or_email = username_or_email;
    this.password = password;
  }
  
  static validationSchema() {
    return Joi.object({
      username_or_email: Joi.string().required(),
      password: Joi.string().min(6).required()
    });
  }

  isValid() {
    const { error } = LoginDTO.validationSchema().validate(this);
    return error ? error.details[0].message : null;  // Return error message if validation fails
  }
}

module.exports = LoginDTO;
