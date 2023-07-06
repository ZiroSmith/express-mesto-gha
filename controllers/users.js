/* eslint-disable semi */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  DONE_CODE,
  CREATE_CODE,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE,
  NOT_FOUND_CODE,
  CONFLICT_CODE,
  GLOBAL_ERROR_SERVER,
} = require('../utils/constants');

// Создать юзера - регистрация:
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.status(CREATE_CODE).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
      } else if (err.code === 11000) {
        res.status(CONFLICT_CODE).send({ message: 'Такой email уже существует' });
      } else {
        res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
      }
    });
};

// Авторизация:
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(FORBIDDEN_CODE).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(UNAUTHORIZED_CODE).send({ message: 'Неправильный логин или пароль' });
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        return res.status(DONE_CODE).send({ token });
      })
    })
    .catch(() => {
      return res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
    });
};

// Найти всех пользователей
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(DONE_CODE).send(users);
    })
    .catch(() => {
      return res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
    });
};

const getMyInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'User Not Found' });
      }
      res.send({ user });
    })
    .catch(() => {
      return res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
    });
};

// Найти пользователя
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not_Found'))
    .then((user) => {
      res.status(DONE_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
      } else if (err.message === 'Not_Found') {
        res.status(NOT_FOUND_CODE).send({ message: 'User Not Found' });
      } else {
        res.status(BAD_REQUEST_CODE).send({ message: 'Server Error' });
      }
    });
};

// Обновить данные пользователя
const updateUserById = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not_Found'))
    .then((user) => res.status(DONE_CODE).send({ data: user }))
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
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
  getMyInfo,
  getUserById,
  createUser,
  login,
  updateUserById,
  updateUserAvatarById,
};
