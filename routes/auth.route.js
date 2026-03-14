const express = require('express')

const router = express.Router()
router.use(express.json());


const userController = require('../controllers/user.controller');
const { registerValidator } = require('../helpers/validation');

router.post('/register', registerValidator, userController.userRegister);
router.post('/login', userController.userSignIn);

module.exports = router;