import Joi from 'joi';

export const createcommunityValidationSchema = Joi.object({
  community_name: Joi.string().max(100).required(),
  description: Joi.string().required(),
  image: Joi.string().uri().optional(),
  image_url: Joi.string().uri().optional(),
  admin_id: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export default { createcommunityValidationSchema };
