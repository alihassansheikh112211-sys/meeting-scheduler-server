const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [3, " Name should be at least of 3 characters"],
    },

    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "please choose one of them "]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email already exist"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password "],
        minLength: [8, "Password should be at least 8 characters"]
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordTokenExpiry: {
        type: Date,
        default: null
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel