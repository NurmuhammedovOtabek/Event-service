const Joi = require("joi");

const companyWorkTimeSchema = Joi.object({
  busy_time: Joi.date().required(),
  companyId: Joi.number().integer().required()
});

module.exports = companyWorkTimeSchema;
