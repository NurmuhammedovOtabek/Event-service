const { sendErrorResponse } = require("../helpers/send.response.errors")
const Company = require("../models/company")
const Contracts = require("../models/contracts")
const {Op} = require("sequelize")
const User = require("../models/user")
const Payments = require("../models/payments")
const Worker = require("../models/worker")


const shart1 = async(req,res)=>{
    try{
        const {start_time, end_time} = req.body
        const contract = await Contracts.findAll({
            where:{
                start_time:{
                    [Op.gt]: start_time
                },
                end_time:{
                    [Op.lt]: end_time 
                }
            },
            include:[
                {model: Worker,as:"worker", attributes: ["role"]},
                {model: Company, as:"copmany", attributes: ["company_name"]}
            ],
            attributes: []
        })
        if(contract.length == 0){
            return sendErrorResponse({message: "Bu vaqt orasida contractlar yo'q"}, res, 500)
        }

        res.status(200).send({
            message: "success",
            data: contract
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const shart2 = async(req,res)=>{
    try{
        const {start_time, end_time} = req.body
        const contract = await Contracts.findAll({
            where:{
                start_time:{
                    [Op.gt]: start_time
                },
                end_time:{
                    [Op.lt]: end_time 
                }
            },
            include:[
                {model: User, as: "user",attributes: ["name"]}
            ],
            attributes: []
        })
        if(contract.length == 0){
            return sendErrorResponse({message: "Bu vaqt orasida contractlar yo'q"}, res, 500)
        }

        res.status(200).send({
            message: "success",
            data: contract
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const shart3 = async(req,res)=>{
    try{
        const {start_time, end_time} = req.body
        const contract = await Contracts.findAll({
            where:{
                start_time:{
                    [Op.gt]: start_time
                },
                end_time:{
                    [Op.lt]: end_time 
                },
                is_active:false
            },
        })
        if(contract.length == 0){
            return sendErrorResponse({message: "Bu vaqt orasida contractlar yo'q"}, res, 500)
        }

        res.status(200).send({
            message: "success",
            data: contract
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const shart4 = async(req,res)=>{
    try{
        const {role} = req.body
        const shart = await Contracts.findAll({
            include:[
                {model: Worker, as:"worker", attributes: ["name", "price", "role"],
                    where: {role: role}
                }
            ],
            where: {is_active:  true}
        })
        if(shart.length == 0){
            return sendErrorResponse({message: "BUnday ishchi contract tuzmagan"}, res, 500)
        }
        res.status(200).send({
            data: shart
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const shart5 = async(req,res)=>{
    try{
        const {name, email} = req.body
        const filtr = await Payments.findAll({
            include: [
                {model: Contracts,
                    as:"cotracts",
                    attributes: [],
                    include: [
                        {model: User, as:"user", where:{email, role: "client"}, attributes:["name", "email"]},
                        {model: Worker, as:"worker", attributes:["role", 'name']},
                        {model: Company, as:"copmany", attributes: ["description", "company_name"]}
                    ],
                    
                }
            ],
            where:{status: "completed"}
        })
        if(filtr.length == 0){
            return sendErrorResponse({message: "Bu sorovga javob yoq"}, res, 400)
        }
        res.status(200).send({
            data: filtr
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    shart1,
    shart2,
    shart3,
    shart4,
    shart5
}