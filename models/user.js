const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 29,
    },
    about: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 29,
    },
    avatar: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('user', userSchema);