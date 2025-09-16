const Joi = require("joi");

const companyServiceSchema = Joi.object({
  serviceId: Joi.number().integer().required(),
  companyId: Joi.number().integer().required()
});

module.exports = companyServiceSchema;
