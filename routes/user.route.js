const express = require('express')
const router = express.Router()

router.use(express.json());

const userController = require('../controller/user.controller');

router.get('/mail-verification', userController.mailVerification)


module.exports = router;