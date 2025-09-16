const { sendErrorResponse } = require("../helpers/send.response.errors")
const Worker = require("../models/worker")
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


const CreateWorker = async(req,res)=>{
    try{
        const {name, role, email, phone, password, description, price} = req.body
        const filtr1 = await Worker.findOne({where:{email}})
        if(filtr1){
            return sendErrorResponse({message: "Bunday emaillik Worker mavjud"}, res, 400)
        }
        const filtr2 = await Worker.findOne({where:{phone}})
        if(filtr2){
            return sendErrorResponse({message: "Bunday telefon raqamli Worker mavjud"}, res, 400)
        }
        
        const hashedPassword = await bcrypt.hash(password, 7)
        const newEorker = await Worker.create({
            name, 
            phone,
            email, 
            password: hashedPassword, 
            role,
            description,
            price
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

const verifyOtp = async(req,rea)=>{
    try{
        const {otp, email} = req.body
        const user = await Worker.findOne({where: {email}})
        const verify = totp.check(otp, email+secretKey)
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

const getAllWorker = async(req,res)=>{
    try{
        const allWorkers = await Worker.findAll()
        if(allWorkers.length == 0){
            return sendErrorResponse({message:"Hali Worker mavjud emas"}, res, 204)
        }
        res.status(200).json({
            message: "Success",
            data: allWorkers,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const findByIdWorker = async(req,res)=>{
    try{
        const id = req.params.id
        const worker = await Worker.findByPk(id)
        if(!worker){
            return sendErrorResponse({message: "Bunday worker mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: worker,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const filtrWorker = async(req,res)=>{
    try{
        const role = req.query.role
        const worker = await Worker.findAll({where: {role}})
        if(!worker){
            return sendErrorResponse({message: "Bunday worker mavjud emas"}, res, 404)
        }
        res.status(200).send({
            message: "Success",
            data: worker,
            statusCode: 200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const updateWorker = async(req,res)=>{
    try{
        const id = req.params.id
        const {name, role, email, phone, password, description} = req.body

        const worker = await Worker.findByPk(id)
        if(!worker){
            return sendErrorResponse({message: "Bunday worker mavjud emas"}, res, 404)
        }
        if(worker.email != email){
            const filtr = await Worker.findOne({where:{ email}})
            if(filtr){
                return sendErrorResponse({message:"Bunday emaillik Worker mavjud"}, res, 400)
            }
        }
        if(worker.phone != phone){
            const filtr = await Worker.findOne({where:{phone}})
            if(filtr){
                return sendErrorResponse({message: "Bunday telefon raqamli Worker mavjud"}, res, 400)
            }
        }
        const coparePassword = await bcrypt.compare(worker.password, password)
        let hashedPassword
        if(!coparePassword){
            hashedPassword = await bcrypt.hash(password, 7)
        }
        const updateWorkerr = await Worker.update({name,
            email,
            phone,
            email,
            password: hashedPassword,
            role,
            description
            },{
                where: {id},
                returning: true
            }
        )
        res.status(200).send({
            message: "Success",
            data: updateWorkerr,
            statusCode:200
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const delWorker = async(req,res)=>{
    try{
        const id = req.params.id
        const filtr = await Worker.findByPk(id)
        if(!filtr){
            return sendErrorResponse({message:"Bunday Worker mavjud emas"}, res, 400)
        }
        await Worker.destroy({where: {id}})
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
    CreateWorker,
    getAllWorker,
    findByIdWorker,
    updateWorker,
    delWorker,
    filtrWorker
}