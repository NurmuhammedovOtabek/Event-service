const router = require("express").Router()
const { CreateService, getAllWorkerSrvice, getAllCompanyService, findByIdService, updateService, delService } = require("../controller/service.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const validation = require("../middlewares/validation")
const serviceSchema = require("../validations/service.validation")

router.post("/", validation(serviceSchema), admin_authGuard , CreateService)
router.get("/worker", getAllWorkerSrvice)
router.get("/company", getAllCompanyService)
router.get("/:id", findByIdService)
router.patch("/:id", validation(serviceSchema), admin_authGuard, updateService)
router.delete("/:id", admin_authGuard, delService)

module.exports = router