const router = require("express").Router()
const { getAllCompanyW } = require("../controller/company_work_time.controller")
const validation = require("../middlewares/validation")

router.get("/", getAllCompanyW)

module.exports =router