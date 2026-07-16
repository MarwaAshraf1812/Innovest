const Joi = require('joi');

const investmentValidationSchema = Joi.object({
    invest_id: Joi.String().integer().required(),
    budget_amount: Joi.float().required(),
    name: Joi.string().min(3).required(), 
    investor_id: Joi.string().hex().length(24).required(), 
    project_id: Joi.string().hex().length(24).required(), 
});

module.exports = { investmentValidationSchema };
