const route = require("express").Router();
const {
  registerWorker,
  login,
  refreshToken,
  logout,
  forgetPassword,
  confirmPassword,
  verifyWorker,
} = require("../auth/worker.auth");
const worker_authGuard = require("../middlewares/guards/worker_auth.guard");
const validation = require("../middlewares/validation");
const workerValidation = require("../validations/worker.validation");

route.post("/register", validation(workerValidation), registerWorker);
route.post("/verfyWorker", verifyWorker)
route.post("/login", login);
route.post("/refreshtoken", refreshToken);
route.post("/logout", worker_authGuard, logout);
route.post("/forgotPass", forgetPassword);
route.post("/confirmPass", confirmPassword);

module.exports = route;
