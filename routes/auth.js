const express = require("express")
const { loginController, registerController, logoutContoller } = require("../controllers/auth")
const router = express.Router()

router.post("/register" ,registerController )
router.post("/login" ,loginController )
router.get("/logout" ,logoutContoller )


module.exports = router