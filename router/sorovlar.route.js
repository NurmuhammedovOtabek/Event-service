const { shart1, shart2, shart3, shart4, shart5 } = require("../controller/sorovlar.controller")

const router = require("express").Router()

router.post("/shart1", shart1)
router.post("/shart2", shart2)
router.post("/shart3", shart3)
router.post("/shart4", shart4)
router.post("/shart5", shart5)

module.exports = router