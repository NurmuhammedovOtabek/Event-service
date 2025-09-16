const router = require("express").Router()
const { CreateWorker, getAllWorker, filtrWorker, findByIdWorker, verifyOtp, updateWorker, delWorker } = require("../controller/worker.controller")
const admin_authGuard = require("../middlewares/guards/admin_auth.guard")
const selfGuard = require("../middlewares/guards/self.guard")
const worker_authGuard = require("../middlewares/guards/worker_auth.guard")
const validation = require("../middlewares/validation")
const workerValidation = require("../validations/worker.validation")

router.post("/", validation(workerValidation), admin_authGuard, CreateWorker)
router.post("/verfy", verifyOtp)
router.get("/", admin_authGuard, getAllWorker)
router.get("/filtr", admin_authGuard, filtrWorker)
router.get("/:id", worker_authGuard, selfGuard, findByIdWorker)
router.patch("/:id", validation(workerValidation), worker_authGuard, selfGuard, updateWorker)
router.delete("/:id", worker_authGuard, selfGuard, delWorker)

module.exports = router