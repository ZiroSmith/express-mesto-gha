const User = require('../models/user');


const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(200).send(users);
        })
};

const getUserById = (req, res) => {
    const { id } = req.params;
    return User.findById(id)
        .then((user) => {
            return res.status(200).send(user);
        })
};

const createUser = (req, res) => {
    const newUserData = req.body;
    return User.create(newUserData)
        .then((newUser) => {
            return res.status(201).send(newUser);
        })
};

const updateUserById = (req, res) => {
    const newUserData = req.body;
    const { id } = req.params;
    return User.findByIdAndUpdate(id, newUserData)
        .then((newUserData) => {
            return res.status(200).send(newUserData);
        })
};

// Обновить аватар
const updateUserAvatarById = (req, res) => {
    const newUserData = req.body;
    const { id } = req.params;
    return User.findByIdAndUpdate(id, newUserData)
        .then((newUserData) => {
            return res.status(200).send(newUserData);
        })
};

const deleteUserById = (req, res) => {
    const { id } = req.params;
    return User.findByIdAndDelete(id)
        .then((user) => {
            return res.status(200).send(user);
        })
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    updateUserAvatarById,
    deleteUserById
}