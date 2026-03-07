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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0 //1 verified, 0 not verified
    },

});

module.exports = mongoose.model("user", userSchema);
