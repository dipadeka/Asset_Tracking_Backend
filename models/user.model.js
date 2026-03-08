const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default:1
    },
    is_verified: {
        type: Number,
        default: 0 //1 verified, 0 not verified
    },

});

module.exports = mongoose.model("user", userSchema);
