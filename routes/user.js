const express = require('express')
const { register, login, forgetPassword, getAllUser, resetPassword, getSingleUser, deleteUser } = require("../controllers/user")
const router = express.Router()

router.get("/get-all-user", getAllUser)

router.get("/get-single-user:id", getSingleUser)

router.delete("/delete-user:id", deleteUser)

router.post('/register', register)

router.post('/login', login)

router.post('/forget-password', forgetPassword)

router.post('/reset-password:token', resetPassword)

module.exports = router