const Joi = require("joi");

const serviceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

module.exports = serviceSchema;
