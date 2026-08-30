import Joi from 'joi';

export const investmentValidationSchema = Joi.object({
    invest_id: Joi.string().required(),
    budget_amount: Joi.number().required(),
    name: Joi.string().min(3).required(), 
    investor_id: Joi.string().hex().length(24).required(), 
    project_id: Joi.string().hex().length(24).required(), 
});

export default { investmentValidationSchema };
