const Joi = require("joi");

const contractSchema = Joi.object({
  duration_minut: Joi.number().valid(1, 30, 60, 120, 180).required(),
  start_time: Joi.date().required(),
  location: Joi.string().min(2).max(255).required(),
  is_active: Joi.boolean().default(true),
  workerId: Joi.number().integer(),
  companyId: Joi.number().integer(),
  userId: Joi.number().integer().required()
});

module.exports = contractSchema;
