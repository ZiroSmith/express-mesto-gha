/* eslint-disable linebreak-style */
const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const { validationSignup, validationSignin } = require('../middlewares/validation');

router.use(userRoutes);
router.use(cardRoutes);
router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
