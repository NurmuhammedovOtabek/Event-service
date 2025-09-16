const { sendErrorResponse } = require("../../helpers/send.response.errors");
const jwtService = require("../../service/jwt.service");


module.exports = async (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader){
            return sendErrorResponse({message: "Auth header not found"}, res, 401)
        }

        const token = authHeader.split(" ")[1]
        if(!token){
            return sendErrorResponse({message: "Token not found"}, res, 400)
        }

        const verifyAccessToken = await jwtService.verifyAccessToken(token)

        req.worker = verifyAccessToken

        next()
    }catch(error){
        sendErrorResponse(error, res, 403)
    }
}