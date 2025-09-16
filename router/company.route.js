const router = require("express").Router()
const { CreateCompany, getAllCompany, filtrCompany, findByIdCompany, updateCompany, delCompany } = require("../controller/company.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const user_authGuard = require("../middlewares/guards/user_auth.guard")
const validation = require("../middlewares/validation")
const companySchema = require("../validations/company.validation")

router.post("/", validation(companySchema), user_authGuard ,CreateCompany)
router.get("/", admin_authGuard, getAllCompany)
router.get("/filtr", filtrCompany)
router.get("/:id", findByIdCompany)
router.patch("/:id", user_authGuard, updateCompany)
router.delete("/:id", admin_authGuard, delCompany)


module.exports = router