const router = require("express").Router()
const { CreateWorker_service, getAllWorkerSrvice, findByIdWService, updateWService, delWService } = require("../controller/worker_service.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const validation = require("../middlewares/validation")
const workerServiceSchema = require("../validations/worker_servise.validation")

router.post("/", admin_authGuard, validation(workerServiceSchema), CreateWorker_service)
router.get("/", getAllWorkerSrvice)
router.get("/:id", findByIdWService)
router.patch("/:id", admin_authGuard, updateWService)
router.delete("/:id", admin_authGuard, delWService)

module.exports = router