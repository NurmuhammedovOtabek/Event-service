const { sendErrorResponse } = require("../helpers/send.response.errors")
const Company = require("../models/company")
const User = require("../models/user")


const CreateCompany = async(req,res)=>{
    try{
        const {userId, company_name, description, phone, price} = req.body
        const filtr1 = await Company.findOne({where:{company_name}})
        if(filtr1){
            return sendErrorResponse({message: "Bunday nomli Company mavjud"}, res, 400)
        }
        const filtr2 = await Company.findOne({where:{phone}})
        if(filtr2){
            return sendErrorResponse({message: "Bunday telefon raqamli Company mavjud"}, res, 400)
        }
        const filtr3 = await User.findByPk(userId)
        if(filtr3.length == 0){
            return sendErrorResponse({message: "Bunday owner mavjud emas"}, res, 400)
        }else{
            if (filtr3.role != "owner"){
                return sendErrorResponse({message: "Bu user company yarata olmaydi"})
            }
        }
        
        const newCompany = await Company.create({
            userId, 
            company_name, 
            description, 
            phone, 
            price
        })

        res.status(201).json({
            message: "Success",
            data: newCompany,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}


const getAllCompany = async(req,res)=>{
    try{
        const allUsers = await Company.findAll()
        if(allUsers.length == 0){
            return sendErrorResponse({message:"Hali Company mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allUsers,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdCompany = async(req,res)=>{
    try{
        const id = req.params.id
        const company = await Company.findByPk(id)
        if(!company){
            return sendErrorResponse({message: "Bunday company mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: company,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const filtrCompany = async(req,res)=>{
    try{
        const {company_name} = req.query
        const company = await Company.findAll({where: {company_name}})
        if(!company){
            return sendErrorResponse({message: "Bunday company mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: company,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateCompany = async(req,res)=>{
    try{
        const {userId, company_name, description, phone, price} = req.body
        const id = req.params.id

        const company = await Company.findByPk(id)
        if(!company){
            return sendErrorResponse({message: "Bunday company mavjud emas"}, res, 404)
        }
        if(company.phone != phone){
            const filtr = await Company.findOne({where:{ phone}})
            if(filtr){
                return sendErrorResponse({message:"Bunday telefon raqamli Company mavjud"}, res, 400)
            }
        }
        if(company.company_name != company_name){
            const filtr = await Company.findOne({where:{ company_name}})
            if(filtr){
                return sendErrorResponse({message:"Bunday nomli Company mavjud"}, res, 400)
            }
        }
        const filtr3 = await User.findByPk(userId)
        if(filtr3.length == 0){
            return sendErrorResponse({message: "Bunday owner mavjud emas"}, res, 400)
        }else{
            if (filtr3.role != "owner"){
                return sendErrorResponse({message: "Bu user company yarata olmaydi"})
            }
        }
        
        const updatedCompany = await Company.update({name,
            company_name,
            phone,
            description,
            price,
            },{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updatedCompany,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delCompany = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Company.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday Company mavjud emas"}, res, 400)
        }
        await Company.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateCompany,
    getAllCompany,
    findByIdCompany,
    updateCompany,
    delCompany,
    filtrCompany
}