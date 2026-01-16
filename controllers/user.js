const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const getAllUser = async (req, res) => {
    try {
        const existingUser = await userModel.find({});

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No users found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Get all users successfully",
            existingUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const existingUser = await userModel.findById(req.params.id)
        res.status(200).json({
            success: true, msg: "Get single user successfully", existingUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}



const deleteUser = async (req, res) => {
    try {
        const existingUser = await userModel.findByIdAndDelete(req.params.id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "User deleted successfully",
            existingUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const register = async (req, res) => {
    const { name, email, gender, password } = req.body
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            success: false,
            msg: "Email already exists, please use another email"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, email, gender, password: hashedPassword })
    const token = jwt.sign({
        email: user.email,
        id: user._id
    }, process.env.JWT_SECRET)
    res.status(201).json({
        success: true,
        msg: "User registered successfully",
        user,
        token
    })
}
const login = async (req, res) => {
    const { email, password } = req.body
    const existingUser = await userModel.findOne({ email })
    if (!existingUser) {
        return res.status(404).json({
            success: false,
            msg: "User don't exist"
        })
    }
    const matchedPassword = await bcrypt.compare(password, existingUser.password)
    if (!matchedPassword) {
        return res.status(400).json({
            success: false,
            msg: "Invalid Credentials"
        })
    }
    const token = jwt.sign({
        email: existingUser.email,
        id: existingUser._id
    }, process.env.JWT_SECRET)
    res.status(200).json({
        success: true,
        msg: "User logged in successfully",
        token
    })
}


const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`
        const mailOptions = {
            from: `"Meeting Scheduler System" ${process.env.SMTP_EMAIL}`,
            to: email,
            subject: "Forget Password Email",
            html: `Please click on this link to reset your password <a href=${resetLink}>${resetLink}</a>`
        }
        await transporter.sendMail(mailOptions)
        // console.log(`Reset Password Link sent to ${email}`)

    } catch (error) {
        // console.log('error', error)
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, msg: "Email not found" });

        // Create JWT token (expires in 1 hour)
        const resetToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save(); // ✅ important
        await sendResetPasswordEmail(email, resetToken);

        res.status(200).json({ success: true, msg: "Reset email sent successfully" });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        let { token } = req.params;

        // Trim extra spaces from token
        token = token.trim();

        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, msg: "Password must be at least 8 characters" });
        }

        // Find user with valid token
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, msg: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Remove reset token & expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;

        // Save changes to database ✅
        await user.save();

        // ✅ Send confirmation email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,     // your Gmail
                pass: process.env.SMTP_PASSWORD   // app password
            }
        });

        const mailOptions = {
            from: `"Meeting Scheduler System" ${process.env.SMTP_EMAIL}`,
            to: user.email,
            subject: "Password Reset Successful",
            html: `
                <h2>Password Reset Successfully</h2>
                <p>Hello ${user.name},</p>
                <p>Your password has been reset successfully. You can now login using your new password.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        // console.log(`Password reset confirmation email sent to ${user.email}`);

        res.status(200).json({ success: true, msg: "Password reset successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
    }
};



module.exports = { register, login, forgetPassword, resetPassword, getAllUser, getSingleUser, deleteUser }