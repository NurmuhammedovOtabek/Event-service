const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  is_active: Joi.boolean().default(true),
  role: Joi.string().valid("owner", "client").required()
});

module.exports = userSchema;
