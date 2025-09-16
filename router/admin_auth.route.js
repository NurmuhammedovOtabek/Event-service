const { login, logout, refreshToken } = require("../auth/admin.auth")

const router = require("express").Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/refreshToken", refreshToken)

module.exports = router