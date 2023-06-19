const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlenght: 2,
        maxlenght: 30,
    },
    about: {
        type: String,
        require: true,
        minlenght: 2,
        maxlenght: 30,
    },
    avatar: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('user', userSchema);