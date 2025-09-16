const Joi = require("joi");

const workerWorkTimeSchema = Joi.object({
    workerId: Joi.number().integer().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required()
});

module.exports = workerWorkTimeSchema;
