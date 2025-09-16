const logger = require("../service/logger.service");

const sendErrorResponse = (error, res, status)=>{
    console.log(error);
    logger.error(error)
    res.status(status).send({
        message: "Xatolik",
        error: error.message,
        statusCode: status
    })
}

module.exports = {sendErrorResponse}