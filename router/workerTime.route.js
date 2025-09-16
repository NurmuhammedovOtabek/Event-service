const router = require("express").Router()
const { CreateWorker_workTime, getAllWorkerW } = require("../controller/worker_workTime.controller")
const worker_authGuard = require("../middlewares/guards/worker_auth.guard")
const validation = require("../middlewares/validation")
const workerWorkTimeSchema = require("../validations/worker_workTime.validation")

router.post("/", validation(workerWorkTimeSchema), worker_authGuard, CreateWorker_workTime)
router.get("/", getAllWorkerW)

module.exports = router