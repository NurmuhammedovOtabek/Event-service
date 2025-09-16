const { sendErrorResponse } = require("../../helpers/send.response.errors");


module.exports = async (req, res, next)=>{
    try{
        if(req.admin){
            if(req.params.id != req.admin.id ||  !req.admin.is_creator){
                return sendErrorResponse({message: "Faqat shaxsiy malumotlarni korish mumkun"}, res, 403)
            }
        }else if(req.user){
            if(req.params.id != req.user.id){
                return sendErrorResponse({message: "Faqat shaxsiy malumotlarni korish mumkun"}, res, 403)
            }
        }else if(req.worker){
            if(req.params.id != req.worker.id){
                return sendErrorResponse({message: "Faqat shaxsiy malumotlarni korish mumkun"}, res, 403)
            }
        }

        next()
    }catch(error){
        sendErrorResponse(error, res, 403)
    }
}