const { sendErrorResponse } = require("../helpers/send.response.errors")
const Worker_workTime = require("../models/worker_workTime")

const CreateWorker_workTime = async(req,res)=>{
    try{
        const {start_time, end_time, workerId} = req.body
        const filtr = await Worker_workTime.findOne({where:{start_time}})
        if(filtr){
            if(filtr.start_time == start_time && filtr.workerId == workerId){
                return sendErrorResponse({message: "Bunday vaqt mavjud"}, res, 400)
            }
        }
        
        const newCW = await Worker_workTime.create({start_time, end_time, workerId})

        res.status(201).json({
            message: "Success",
            data: newCW,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllWorkerW = async(req,res)=>{
    try{
        const allWwT = await Worker_workTime.findAll()
        if(allWwT.length == 0){
            return sendErrorResponse({message:"Hali Worker_workTime mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allWwT,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdWorkerW = async(req,res)=>{
    try{
        const id = req.params.id
        const CWt = await Worker_workTime.findByPk(id)
        if(!CW){
            return sendErrorResponse({message: "Bunday worker work_time mavjud emas"}, res, 404)
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

const updateWorkerW = async(req,res)=>{
    try{
        const {start_time, end_time, workerId} = req.body
        const id = req.params.id

        const serivce = await Worker_workTime.findByPk(id)
        if(!serivce){
            return sendErrorResponse({message: "Bunday worker workTime mavjud emas"}, res, 404)
        }
        const filtr1 = await Worker_workTime.findOne({where:{start_time}})
        if(filtr1){
            if(filtr1.workerId = workerId){
                return sendErrorResponse({message: "Bunday nomli Worker_workTime mavjud"}, res, 400)
            }
        }
        
        const updatedCWt = await Worker_workTime.update({start_time, end_time, workerId},{
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

const delWorkerW = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Worker_workTime.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday worker work time mavjud emas"}, res, 400)
        }
        await Worker_workTime.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateWorker_workTime,
    getAllWorkerW,
    findByIdWorkerW,
    updateWorkerW,
    delWorkerW
}