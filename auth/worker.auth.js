const { sendErrorResponse } = require("../helpers/send.response.errors");
const Worker = require("../models/worker");
const bcrypt = require("bcrypt");
const jwtService = require("../service/jwt.service");
const config = require("config");
const nodemailer = require("nodemailer")
const {totp} = require("otplib")

const secretKey = config.get("secretKey")

const emilerTransport = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: config.get("user"),
        pass: config.get("pass")
    }
})

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const worker = await Worker.findOne({ where: { email } });
        if (!worker) {
      return sendErrorResponse(
          { message: "Email yoki password noto'g'ri" },
          res,
          401
        );
    }
    const verifyPassword = await bcrypt.compare(password, worker.password);
    if (!verifyPassword) {
        return sendErrorResponse(
        { message: "Email yoki password noto'g'ri" },
        res,
        401
    );
}
    const payload = {
        id: worker.id,
      email: worker.email,
      is_active: worker.is_active,
      role: worker.role
    };
    const tokens = jwtService.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    worker.refresh_token = hashedRefreshToken;
    await worker.save();
    
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("cookie_refresh_time"),
        httpOnly: true,
    });
    
    
    res.status(200).json({
        message: "Worker logged in",
        accessToken: tokens.accessToken,
    });
} catch (error) {
    sendErrorResponse(error, res, 500);
}
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return sendErrorResponse(
                { message: "Cookieda refresh token topilmadi" },
                res,
        400
    );
}
const verifydRefreshToken = await jwtService.verifyRefreshToken(
      refreshToken
    );
    
    const worker = await Worker.findByPk(verifydRefreshToken.id);
    worker.refresh_token = null;
    await worker.save();
    
    res.clearCookie("refreshToken");
    res.send({
        message: "Worker loget out",
    });
} catch (error) {
    sendErrorResponse(error, res, 500);
}
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return sendErrorResponse(
        { message: "Cookieda refresh token topilmadi" },
        res,
        400
    );
    }

    const verifydRefreshToken = await jwtService.verifyRefreshToken(
        refreshToken
    );

    const worker = await Worker.findByPk(verifydRefreshToken.id);
    
    const compareRefreshToken = await bcrypt.compare(refreshToken, worker.refresh_token)
    if(!compareRefreshToken){
        return sendErrorResponse({message: "Refresh token notog'ri"}, res, 400)
    }
    
    const payload = {
        id: worker.id,
        email: worker.email,
        is_active: worker.is_active,
        role: worker.role
    };
    const tokens = jwtService.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    worker.refresh_token = hashedRefreshToken;
    await worker.save();
    
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("cookie_refresh_time"),
        httpOnly: true,
    });
    
    res.status(200).json({
        message: "Tokens refreshed",
        accessToken: tokens.accessToken,
    });
    
} catch (error) {
    sendErrorResponse(error, res, 500);
}
};

const forgetPassword = async(req,res)=>{
    try{
        const {email} = req.body
        const find = await Worker.findOne({where: {email}})
        if(!find){
            return sendErrorResponse({message: "Bu email topilmadi"})
        } 
        const otp = totp.generate(email+secretKey)
        emilerTransport.sendMail({
            to:email,
            subject: "100 ball olish uchun kod",
            text: `${otp}`
        })
        
        res.send({
            message: "Emailga kod yuborildi"
        })
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const confirmPassword = async(req,res)=>{
    try{
        const {email, otp, password} = req.body
        const worker = await Worker.findOne({where:{email}})
        if(!worker){
            return sendErrorResponse({message: "Email hato"}, res, 500)
        }
        const verify = totp.check(otp, email+secretKey)
        if(!verify){
            return sendErrorResponse({message:"Otp xato"}, res, 500)
        }
        const hashedPassword = await bcrypt.hash(password, 7)
        worker.password = hashedPassword
        await worker.save()
        res.status(200).send({message:"Parol yangilandi"}, res, 200)
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const registerWorker = async(req,res)=>{
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

const verifyWorker = async(req,rea)=>{
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


module.exports = {
    login,
    logout,
    refreshToken,
    forgetPassword,
    confirmPassword,
    registerWorker,
    verifyWorker
};
