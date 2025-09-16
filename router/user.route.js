const {
  CreateUser,
  verifyOtp,
  getAllUser,
  filtrUser,
  findByIdUser,
  updateUser,
  delUser,
} = require("../controller/user.controller");
const admin_authGuard = require("../middlewares/guards/admin_auth.guard");
const selfGuard = require("../middlewares/guards/self.guard");
const user_authGuard = require("../middlewares/guards/user_auth.guard");

const validation = require("../middlewares/validation")
const userSchema = require("../validations/user.validation")

const route = require("express").Router();

route.post("/", validation(userSchema), admin_authGuard,CreateUser);
route.post("/vrify", admin_authGuard, verifyOtp);
route.get("/", admin_authGuard ,getAllUser);
route.get("/filtr", admin_authGuard, filtrUser);
route.get("/:id", user_authGuard, selfGuard,findByIdUser);
route.patch("/:id", validation(userSchema), user_authGuard, selfGuard, updateUser);
route.delete("/:id",user_authGuard, selfGuard, delUser);

module.exports = route;
