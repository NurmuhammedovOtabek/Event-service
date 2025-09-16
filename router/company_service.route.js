const router = require("express").Router()
const { CreateCompany_service, getAllCompanySrvice, findByIdCService, updateCService, delCService } = require("../controller/company_service.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const validation = require("../middlewares/validation")
const companyServiceSchema = require("../validations/company_servic.validation")

router.post("/", validation(companyServiceSchema), admin_authGuard, CreateCompany_service)
router.get("/", getAllCompanySrvice)
router.get("/:id", findByIdCService)
router.patch("/:id", admin_authGuard, updateCService)
router.delete("/:id", admin_authGuard, delCService)

module.exports = router