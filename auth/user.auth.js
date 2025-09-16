const { sendErrorResponse } = require("../helpers/send.response.errors");
const User = require("../models/user");
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendErrorResponse(
        { message: "Email yoki password noto'g'ri" },
        res,
        401
      );
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "Email yoki password noto'g'ri" },
        res,
        401
      );
    }
    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      role: user.role
    };
    const tokens = jwtService.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    user.refresh_token = hashedRefreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });


    res.status(200).json({
      message: "User logged in",
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

    const user = await User.findByPk(verifydRefreshToken.id);
    user.refresh_token = null;
    await user.save();

    res.clearCookie("refreshToken");
    res.send({
      message: "User loget out",
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

    const user = await User.findByPk(verifydRefreshToken.id);

    const compareRefreshToken = await bcrypt.compare(refreshToken, user.refresh_token)
    if(!compareRefreshToken){
        return sendErrorResponse({message: "Refresh token notog'ri"}, res, 400)
    }

    const payload = {
        id: user.id,
        email: user.email,
        is_active: user.is_active,
        role: user.role
      };
      const tokens = jwtService.generateTokens(payload);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
      user.refresh_token = hashedRefreshToken;
      await user.save();
  
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
        const find = await User.findOne({where: {email}})
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
        const user = await User.findOne({where:{email}})
        if(!user){
            return sendErrorResponse({message: "Email hato"}, res, 500)
        }
        const verify = totp.check(otp, email+secretKey)
        if(!verify){
            return sendErrorResponse({message:"Otp xato"}, res, 500)
        }
        const hashedPassword = await bcrypt.hash(password, 7)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({message:"Parol yangilandi"}, res, 200)
    }catch(error){
        sendErrorResponse(error,res,500)
    }
}

const register = async(req,res)=>{
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

const verifyRegister = async(req,res)=>{
    try{
        const {otp, email} = req.body
        const user = await User.findOne({where: {email}})
        console.log(otp, email);
        
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

module.exports = {
  login,
  logout,
  refreshToken,
  forgetPassword,
  confirmPassword,
  register,
  verifyRegister
};
