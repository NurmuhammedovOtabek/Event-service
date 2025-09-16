const { sendErrorResponse } = require("../helpers/send.response.errors")
const Company_workTime = require("../models/company_workTime")

const CreateCompany_workTime = async(req,res)=>{
    try{
        const {start_time,end_time, companyId} = req.body
        const filtr = await Company_workTime.findOne({where:{start_time}})
        if(filtr){
            if(filtr.start_time == start_time && filtr.companyId == companyId){
                return sendErrorResponse({message: "Bunday vaqt mavjud"}, res, 400)
            }
        }
        
        const newCW = await Company_workTime.create({start_time, companyId})

        res.status(201).json({
            message: "Success",
            data: newCW,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllCompanyW = async(req,res)=>{
    try{
        const allCW = await Company_workTime.findAll()
        if(allCW.length == 0){
            return sendErrorResponse({message:"Hali Company_workTime mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allCW,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdCW = async(req,res)=>{
    try{
        const id = req.params.id
        const CWt = await Company_workTime.findByPk(id)
        if(!CW){
            return sendErrorResponse({message: "Bunday company work_time mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: CWt,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateCW = async(req,res)=>{
    try{
        const {start_time, end_time, companyId} = req.body
        const id = req.params.id

        const serivce = await Company_workTime.findByPk(id)
        if(!serivce){
            return sendErrorResponse({message: "Bunday company workTime mavjud emas"}, res, 404)
        }
        const filtr1 = await Company_workTime.findOne({where:{start_time}})
        if(filtr1){
            if(filtr1.companyId = companyId){
                return sendErrorResponse({message: "Bunday nomli Company_workTime mavjud"}, res, 400)
            }
        }
        
        const updatedCWt = await Company_workTime.update({start_time, end_time, companyId},{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updatedCWt,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delCW = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Company_workTime.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday company work time mavjud emas"}, res, 400)
        }
        await Company_workTime.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateCompany_workTime,
    getAllCompanyW,
    findByIdCW,
    updateCW,
    delCW
}