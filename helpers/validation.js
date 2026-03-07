const { check } = require('express-validator');

exports.registerValidator = [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Invalid Email').isEmail(),
    // check('mobile','Mobile is required').isLength({min:10,max:10}),
    check('password', 'Password is required').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
];