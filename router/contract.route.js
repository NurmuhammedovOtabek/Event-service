const router = require("express").Router()

const { CreateContracts, getAllContracts, findByIdContracts, updateContract, delContracts } = require("../controller/contract.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const user_authGuard = require("../middlewares/guards/user_auth.guard")
const validation = require("../middlewares/validation")
const contractSchema = require("../validations/contracts.validations")

router.post("/", validation(contractSchema), user_authGuard, CreateContracts)
router.get("/", admin_authGuard, getAllContracts)
router.get("/:id", user_authGuard, findByIdContracts)
router.patch("/:id", validation(contractSchema), user_authGuard, updateContract)
router.delete("/:id", user_authGuard, delContracts)

module.exports = router