const { sendErrorResponse } = require("../helpers/send.response.errors");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwtService = require("../service/jwt.service");
const config = require("config");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return sendErrorResponse(
        { message: "Email yoki password noto'g'ri" },
        res,
        401
      );
    }
    const verifyPassword = await bcrypt.compare(password, admin.password);
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "Email yoki password noto'g'ri" },
        res,
        401
      );
    }
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };
    const tokens = jwtService.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    admin.refresh_token = hashedRefreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });


    res.status(200).json({
      message: "Admin logged in",
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

    const admin = await Admin.findByPk(verifydRefreshToken.id);
    admin.refresh_token = null;
    await admin.save();

    res.clearCookie("refreshToken");
    res.send({
      message: "Admin loget out",
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

    const admin = await Admin.findByPk(verifydRefreshToken.id);

    const compareRefreshToken = await bcrypt.compare(refreshToken, admin.refresh_token)
    if(!compareRefreshToken){
        return sendErrorResponse({message: "Refresh token notog'ri"}, res, 400)
    }

    const payload = {
        id: admin.id,
        email: admin.email,
        is_active: admin.is_active,
        is_creator: admin.is_creator,
      };
      const tokens = jwtService.generateTokens(payload);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
      admin.refresh_token = hashedRefreshToken;
      await admin.save();
  
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

module.exports = {
  login,
  logout,
  refreshToken
};
