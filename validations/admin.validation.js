const Joi = require("joi");

const adminSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  is_active: Joi.boolean().required(),
});

module.exports = adminSchema