const Joi = require("joi");

const paymentSchema = Joi.object({
  method: Joi.string().valid("cash","card").required(),
  amount: Joi.number().precision(2).required(),
  status: Joi.string().valid("pending","completed","failed"),
  paid_at: Joi.date().required(),
  contractId: Joi.number().integer().required()
});

module.exports = paymentSchema;
