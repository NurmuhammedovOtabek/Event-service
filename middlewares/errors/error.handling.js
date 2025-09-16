const ApiError = require("../../helpers/api.errors");
const logger = require("../../service/logger.service");

module.exports = function(err, req, res, next){
    console.log(err);
    logger.error(err)
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message})
    }

    if(err instanceof SyntaxError){
        return res.status(err.status).json({message: err.message})
    }    

    if(err instanceof TypeError){
        return res.status(err.status).json({message: err.message})
    }

    return res.status(500).json({message: "Nazarda tutilmagan xatolik"})
}