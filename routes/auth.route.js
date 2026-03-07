const express = require('express')

const router = express.Router()
router.use(express.json());


const userController = require('../controller/user.controller');
const { registerValidator } = require('../helpers/validation');

router.post('/register', registerValidator, userController.userRegister);

module.exports = router;