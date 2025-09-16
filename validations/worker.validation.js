const Joi = require("joi")

const workerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid("DJ", "Decor", "Dancer", "video_montaj", "Videographer").required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/).required(),
  password: Joi.string().min(6).max(100).required(),
  price: Joi.number().precision(2).positive().required(),
  is_active: Joi.boolean().default(false),
  description: Joi.string().min(10).required()
})

module.exports = workerValidation
