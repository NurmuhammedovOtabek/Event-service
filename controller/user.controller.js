const { sendErrorResponse } = require("../helpers/send.response.errors")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const {totp} = require("otplib")
const config = require("config")

const secretKey = config.get("secretKey")

const emilerTransport = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: config.get("user"),
        pass: config.get("pass")
    }
})



const CreateUser = async(req,res)=>{
    try{
        const {name, phone, email, password, role} = req.body
        const filtr1 = await User.findOne({where:{email}})
        if(filtr1){
            return sendErrorResponse({message: "Bunday emaillik User mavjud"}, res, 400)
        }
        
        const hashedPassword = await bcrypt.hash(password, 7)
        const newAdmin = await User.create({
            name, 
            phone,
            email, 
            password: hashedPassword, 
            role
        })

        const otp = totp.generate(email+secretKey)
        emilerTransport.sendMail({
            from: config.get("user"),
            to:email,
            subject: "100 ball olish uchun kod",
            text: `${otp}`
        })

        res.status(201).json({
            message: "emilga kod yuborildi",
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const verifyOtp = async(req,res)=>{
    try{
        const {otp, email} = req.body
        const user = await User.findOne({where: {email}})
        const verify = totp.check(otp, email+secretKey)
        console.log(verify);
        
        if(!verify){
            return sendErrorResponse({message: "otp notog'ri"}, res, 400)
        }
        user.is_active = true
        user.save()
        res.status(200).send({
            message:"royxatdan otdingiz",
            statusCode: 200
        })

    }catch(error){
        sendErrorResponse(error,res,500)
    } 
}

const getAllUser = async(req,res)=>{
    try{
        const allUsers = await User.findAll()
        if(allUsers.length == 0){
            return sendErrorResponse({message:"Hali User mavjud emas"}, res, 204)
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

const findByIdUser = async(req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findByPk(id)
        if(!user){
            return sendErrorResponse({message: "Bunday user mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: user,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const filtrUser = async(req,res)=>{
    try{
        const name = req.query.name
        const user = await User.findAll({where: {name}})
        if(!user){
            return sendErrorResponse({message: "Bunday user mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: user,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateUser = async(req,res)=>{
    try{
        const {name, phone, email, password} = req.body
        const id = req.params.id

        const user = await User.findByPk(id)
        if(!user){
            return sendErrorResponse({message: "Bunday user mavjud emas"}, res, 404)
        }
        if(user.email != email){
            const filtr = await User.findOne({where:{ email}})
            if(filtr){
                return sendErrorResponse({message:"Bunday emaillik User mavjud"}, res, 400)
            }
        }
        const coparePassword = await bcrypt.compare(user.password, password)
        let hashedPassword
        if(!coparePassword){
            hashedPassword = await bcrypt.hash(password, 7)
        }
        const updateUser = await User.update({name,
            email,
            phone,
            email,
            password: hashedPassword,
            },{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updateUser,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delUser = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await User.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday User mavjud emas"}, res, 400)
        }
        await User.destroy({where: {id}})
        res.status(204).send({
            message: "Deleted seccessfully",
            statusCode: 204
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

module.exports = {
    verifyOtp,
    CreateUser,
    getAllUser,
    findByIdUser,
    updateUser,
    delUser,
    filtrUser,
}