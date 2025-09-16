const { sendErrorResponse } = require("../helpers/send.response.errors")
const Company_service = require("../models/company_service")
const Service = require("../models/service.model")
const Company = require("../models/company")

const CreateCompany_service = async(req,res)=>{
    try{
        const {serviceId, companyId} = req.body
        const filtr1 = await Company_service.findOne({where:{serviceId}})
        if(filtr1){
            if(filtr1.companyId == companyId){
                return sendErrorResponse({message: "Bunday nomli Company Service mavjud"}, res, 400)
            }
        }
        
        const newCService = await Company_service.create({serviceId, companyId})

        res.status(201).json({
            message: "Success",
            data: newCService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllCompanySrvice = async(req,res)=>{
    try{
        const allCService = await Company_service.findAll({
            include: [
                {
                  model: Company,
                  as: "worker", 
                  attributes: ["company_name", "price"]
                },
                {
                  model: Service,
                  as: "service", 
                  attributes: ["name"]
                }
              ]
        })
        if(allCService.length == 0){
            return sendErrorResponse({message:"Hali Company Service mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allCService,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdCService = async(req,res)=>{
    try{
        const id = req.params.id
        const service = await Company_service.findByPk(id,{
            include: [
                {
                  model: Company,
                  as: "worker", 
                  attributes: ["company_name", "price"]
                },
                {
                  model: Service,
                  as: "service", 
                  attributes: ["name"]
                }
              ]
        })
        if(!service){
            return sendErrorResponse({message: "Bunday company service mavjud emas"}, res, 404)
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

const updateCService = async(req,res)=>{
    try{
        const {serviceId, companyId} = req.body
        const id = req.params.id

        const serivce = await Company_service.findByPk(id)
        if(!serivce){
            return sendErrorResponse({message: "Bunday company serivce mavjud emas"}, res, 404)
        }
        const filtr1 = await Company_service.findOne({where:{serviceId}})
        if(filtr1){
            if(filtr1.companyId = companyId){
                return sendErrorResponse({message: "Bunday nomli Company Service mavjud"}, res, 400)
            }
        }
        
        const updatedCService = await Company_service.update({serviceId, companyId},{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updatedCService,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delCService = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Company_service.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday company Service mavjud emas"}, res, 400)
        }
        await Company_service.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateCompany_service,
    getAllCompanySrvice,
    findByIdCService,
    updateCService,
    delCService
}