const Joi = require("joi");

const workerServiceSchema = Joi.object({
  serviceId: Joi.number().integer().required(),
  workerId: Joi.number().integer().required()
});

module.exports = workerServiceSchema;
