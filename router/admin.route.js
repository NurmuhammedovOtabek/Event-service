const { CreateAdmin, getAllAdmin, filtrAdmin, findByIdAdmins, updateAdmins, delAdmin } = require("../controller/admins.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const creatorGuard = require("../middlewares/guards/creator.guard")
const selfGuard = require("../middlewares/guards/self.guard")
const validation = require("../middlewares/validation")
const adminSchema = require("../validations/admin.validation")


const router = require("express").Router()

router.post("/", validation(adminSchema), admin_authGuard, creatorGuard,CreateAdmin)
router.get("/", admin_authGuard, creatorGuard, getAllAdmin)
router.get("/filtr",  admin_authGuard, creatorGuard, filtrAdmin)
router.get("/:id", admin_authGuard, selfGuard,findByIdAdmins)
router.patch("/:id", validation(adminSchema),  admin_authGuard, creatorGuard, updateAdmins)
router.delete("/:id", admin_authGuard, selfGuard, delAdmin)

module.exports = router