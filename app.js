const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключение к БД - успешно');
});

const app = express();

app.use(bodyParser.json());

app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '648fff99a4828d08b55f019e'
  };

  next();
}); 

app.listen(PORT, () => {
  console.log('Порт сервера 3000');
});