const express = require('express')
const router = express();
router.use(express.json());
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }

});

const fileFilter = function (req, file, cb) {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });



const userController = require('../controller/user.controller');
const { registerValidator } = require('../helpers/validation');

router.post('/register', registerValidator, userController.userRegister);

module.exports = router;