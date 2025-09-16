const Joi = require("joi");

const companySchema = Joi.object({
  company_name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  phone: Joi.string()
    .pattern(/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/)
    .required(),
  price: Joi.number().precision(2).positive().required(),
  userId: Joi.number().integer().required()
});

module.exports = companySchema;
