const { sendErrorResponse } = require("../helpers/send.response.errors")
const Admin = require("../models/admin")
const bcrypt = require("bcrypt")

const CreateAdmin = async(req,res)=>{
    try{
        const {name, email, password, is_creator, is_active} = req.body
        const filtr1 = await Admin.findOne({where:{email}})
        if(filtr1){ 
            return sendErrorResponse({message: "Bunday emaillik Admin mavjud"}, res, 400)
        }
        const filtr2 = await Admin.findOne({where:{name}})
        if(filtr2){
            return sendErrorResponse({message: "Bunday ismli Admin mavjud"}, res, 400)
        }
        const hashedPassword = await bcrypt.hash(password, 7)
        const newAdmin = await Admin.create({
            name, 
            email, 
            password: hashedPassword, 
            is_creator, 
            is_active
        })
        res.status(201).json({
            message: "Create successfully",
            data: newAdmin,
            statusCode:201
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const getAllAdmin = async(req,res)=>{
    try{
        const allAdmins = await Admin.findAll()
        if(allAdmins.length == 0){
            return sendErrorResponse({message:"Hali Adminlar mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allAdmins,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdAdmins = async(req,res)=>{
    try{
        const id = req.params.id
        const admin = await Admin.findByPk(id)
        if(!admin){
            return sendErrorResponse({message: "Bunday admin mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: admin,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const filtrAdmin = async(req,res)=>{
    try{
        const name = req.query.name
        const findAdmin = await Admin.findAll({where: {name}})
        if(!findAdmin){
            return sendErrorResponse({message: "Bunday admin mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: findAdmin,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateAdmins = async(req,res)=>{
    try{
        const {name, email, password, is_active} = req.body
        const id = req.params.id

        const admin = await Admin.findByPk(id)
        if(!admin){
            return sendErrorResponse({message: "Bunday admin mavjud emas"}, res, 404)
        }
        if(admin.email != email){
            const filtr = await Admin.findOne({where:{ email}})
            if(filtr){
                return sendErrorResponse({message:"Bunday emaillik Admin mavjud"}, res, 400)
            }
        }
        if(admin.name != name){
            const filtr = await Admin.findOne({where:{ name}})
            if(filtr){
                return sendErrorResponse({message:"Bunday ismli Admin mavjud"}, res, 400)
            }
        }
        const coparePassword = await bcrypt.compare(admin.password, password)
        let hashedPassword
        if(!coparePassword){
            hashedPassword = await bcrypt.hash(password, 7)
        }
        const updateAdmin = await Admin.update({name,
            email,
            password: hashedPassword,
            is_active},{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updateAdmin,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delAdmin = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Admin.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday Admin mavjud emas"}, res, 400)
        }
        await Admin.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    CreateAdmin,
    getAllAdmin,
    findByIdAdmins,
    updateAdmins,
    delAdmin,
    filtrAdmin
}