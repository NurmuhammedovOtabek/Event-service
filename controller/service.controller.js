const { sendErrorResponse } = require("../helpers/send.response.errors")
const Service = require("../models/service.model")
const Worker = require("../models/worker")
const Company = require("../models/company")

const CreateService = async(req,res)=>{
    try{
        const {name} = req.body
        const filtr1 = await Service.findOne({where:{name}})
        if(filtr1){
            return sendErrorResponse({message: "Bunday nomli Service mavjud"}, res, 400)
        }
        
        const newService = await Service.create({name})

        res.status(201).json({
            message: "Success",
            data: newService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}


const getAllWorkerSrvice = async(req,res)=>{
    try{
        const allService = await Service.findAll({
            include:{
                model: Worker,
                through: {attributes: []},
                attributes: ["name", "role", "price"]
            }
        })
        if(allService.length == 0){
            return sendErrorResponse({message:"Hali Service mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allService,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllCompanyService = async(req,res)=>{
    try{
        const allService = await Service.findAll({
            include:{
                model: Company,
                through: {attributes: []},
                attributes: ["company_name", "price"]
            }
        })
        if(allService.length == 0){
            return sendErrorResponse({message:"Hali Service mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allService,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdService = async(req,res)=>{
    try{
        const id = req.params.id
        const service = await Service.findByPk(id,{
            include:{
                model: Worker,
                through: {attributes: []},
                attributes: ["name", "role", "price"]
            }
        })
        if(!service){
            return sendErrorResponse({message: "Bunday service mavjud emas"}, res, 404)
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

const updateService = async(req,res)=>{
    try{
        const {name} = req.body
        const id = req.params.id

        const serivce = await Service.findByPk(id)
        if(!serivce){
            return sendErrorResponse({message: "Bunday serivce mavjud emas"}, res, 404)
        }
        if(serivce.name != name){
            const filtr = await Service.findOne({where:{ name}})
            if(filtr){
                return sendErrorResponse({message:"Bunday nomli Service mavjud"}, res, 400)
            }
        }
        
        const updatedService = await Service.update({name},{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updatedService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delService = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Service.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday Service mavjud emas"}, res, 400)
        }
        await Service.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateService,
    getAllWorkerSrvice,
    getAllCompanyService,
    findByIdService,
    updateService,
    delService
}