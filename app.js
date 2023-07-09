/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключение к БД - успешно');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);
app.use(auth);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Порт сервера 3000');
});
