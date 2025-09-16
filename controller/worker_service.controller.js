const { sendErrorResponse } = require("../helpers/send.response.errors")
const Worker_service = require("../models/worker_service")
const Service = require("../models/service.model")
const Worker = require("../models/worker")

const CreateWorker_service = async(req,res)=>{
    try{
        const {serviceId, workerId} = req.body
        const filtr1 = await Worker_service.findOne({where:{serviceId}})
        if(filtr1){
            if(filtr1.workerId == workerId){
                return sendErrorResponse({message: "Bunday nomli Worker Service mavjud"}, res, 400)
            }
        }
        
        const newWService = await Worker_service.create({serviceId, workerId})

        res.status(201).json({
            message: "Success",
            data: newWService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllWorkerSrvice = async(req,res)=>{
    try{
        const allWService = await Worker_service.findAll({
            include: [
                {
                  model: Worker,
                  as: "worker", 
                  attributes: ["name", "price", "role"]
                },
                {
                  model: Service,
                  as: "service", 
                  attributes: ["name"]
                }
              ]
        })
        if(allWService.length == 0){
            return sendErrorResponse({message:"Hali Worker Service mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allWService,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdWService = async(req,res)=>{
    try{
        const id = req.params.id
        const service = await Worker_service.findByPk(id,{
            include: [
                {
                  model: Worker,
                  as: "worker", 
                  attributes: ["name", "price", "role",]
                },
                {
                  model: Service,
                  as: "service", 
                  attributes: ["name"]
                }
              ]
        })
        if(!service){
            return sendErrorResponse({message: "Bunday worker service mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: service,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateWService = async(req,res)=>{
    try{
        const {serviceId, workerId} = req.body
        const id = req.params.id

        const serivce = await Worker_service.findByPk(id)
        if(!serivce){
            return sendErrorResponse({message: "Bunday worker serivce mavjud emas"}, res, 404)
        }
        const filtr1 = await Worker_service.findOne({where:{serviceId}})
        if(filtr1){
            if(filtr1.workerId = workerId){
                return sendErrorResponse({message: "Bunday nomli worker Service mavjud"}, res, 400)
            }
        }
        
        const updatedWService = await Worker_service.update({serviceId, workerId},{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updatedWService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delWService = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Worker_service.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday worker Service mavjud emas"}, res, 400)
        }
        await Worker_service.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateWorker_service,
    getAllWorkerSrvice,
    findByIdWService,
    updateWService,
    delWService
}