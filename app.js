/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключение к БД - успешно');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(3).max(29),
    about: Joi.string().min(3).max(29),
    avatar: Joi.string().pattern(/^[a-z]{5}[:]{1}[{2}[a-z]{8}[.]{1}[a-z]{1}[0-9]{1}[.]{1}[a-z]{6}[.]{1}[a-z]{3}[{1}[a-z]{9}[{1}[a-z]{7}[-]{1}[a-z]{8}[_]{1}[0-9]{10}[.]{1}[a-z]{3}$/),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use(routes);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log('Порт сервера 3000');
});
