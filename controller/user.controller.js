const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const user = require('../models/user.model');

const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errors',
                errors: errors.array()
            });
        }
        const { name, email, password } = req.body;

        const isExist = await user.findOne({ email });

        if (isExist) {
            return res.status(400).json({
                success: false,
                message: 'Email Already Exists'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userData = new user({
            name,
            email,
            password: hashPassword,

        });

        await userData.save();

        return res.status(201).json({
            success: true,
            message: 'Registered Successfully',
            user: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const mailVerification = async (req, res) => {
    try {
        if (req.query.id == undefined) {
            return res.render('404');
        }
        else {
            return res.render('mail-verification', { message: 'User not found' })
        }
    } catch (error) {
        return res.render('404');
    }
}

module.exports = { userRegister, mailVerification };