const { login, register, verifyRegister, logout, refreshToken, forgetPassword, confirmPassword } = require("../auth/user.auth")
const user_authGuard = require("../middlewares/guards/user_auth.guard")
const validation = require("../middlewares/validation")
const userSchema = require("../validations/user.validation")

const route = require("express").Router()

route.post("/login", login),
route.post("/register", validation(userSchema), register)
route.post("/verfyR", verifyRegister)
route.post("/logout", user_authGuard ,logout)
route.post("/refreshToken", refreshToken),
route.post("/forgotPass", forgetPassword),
route.post("/confitmPass", confirmPassword)

module.exports = route