const router = require("express").Router()
const { CreatePayment, getAllPayments, findByIdPayments } = require("../controller/payments.controller")
const user_authGuard = require("../middlewares/guards/user_auth.guard")
const validation = require("../middlewares/validation")
const paymentSchema = require("../validations/payments.validation")

router.post("/", validation(paymentSchema), user_authGuard, CreatePayment)
router.get("/", user_authGuard, getAllPayments)
router.get("/:id", findByIdPayments)


module.exports = router