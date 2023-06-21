const User = require('../models/user');
const { DONE_CODE, 
        CREATE_CODE, 
        BAD_REQUEST_CODE, 
        NOT_FOUND_CODE, 
        GLOBAL_ERROR_SERVER } = require('../utils/constants');

// Найти всех пользователей
const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(DONE_CODE).send(users);
        })
        .catch((err) => {
            return res.status(GLOBAL_ERROR_SERVER).send({ message: "Server Error" })
        })
};

// Найти пользователя
const getUserById = (req, res) => {
    User.findById(req.params.id)
        .orFail(new Error('NotValidId'))
        .then((user) => {
            res.status(DONE_CODE).send(user);
        })
        .catch((err) => {
            if (err.message === 'NotValidId') {
                return res.status(BAD_REQUEST_CODE).send({message: "User Not Found"})
            } else {
                res.status(GLOBAL_ERROR_SERVER).send({ message: "Server Error" })
            }
        })
};

// Создать пользователя
const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
        .then((newUser) => {
            res.status(CREATE_CODE).send(newUser);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(BAD_REQUEST_CODE).send({ message: "Validation Error" })
                return;
            } else {
                res.status(GLOBAL_ERROR_SERVER).send({ message: "Server Error" });
                return;
            }
        })
};

// Обновить данные пользователя
const updateUserById = (req, res) => {
    const { name, about } = req.body;
    const { id } = req.params;
    User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
      .orFail(() => new Error('Not_Found'))
      .then((user) => res.status(DONE_CODE).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
        } else if (err.message === 'Not_Found') {
          res.status(NOT_FOUND_CODE).send({ message: 'User Not Found' });
        } else {
          res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
        }
      });
  };

// Обновить аватар
const updateUserAvatarById = (req, res) => {
    const { avatar } = req.body;
    const { id } = req.params;
    User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
      .orFail(() => new Error('Not_Found'))
      .then((user) => res.status(DONE_CODE).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
        } else if (err.message === 'Not_Found') {
          res.status(NOT_FOUND_CODE).send({ message: 'User Not Found' });
        } else {
          res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
        }
      });
  };


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    updateUserAvatarById
}