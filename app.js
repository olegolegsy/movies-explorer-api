// заметки для себя любимого
// не забыть удалить конслолог из порта (линтер напомнит)
// кинолента/ любитель фильмов (прикольное название найти) - кинозритель
// попросить примеры карточек фильмов (тестирование кинолент)

// валидация через селебрейты
// файлик с константами
// файлик мидлвар с централизованной обработкой ошибок

// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// vars
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;

// utils
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('такой страницы не существует'));
});

app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

mongoose.connect(DB_URL).then(() =>
  app.listen(PORT, () => {
    console.log(`работаем на ${PORT} порту`);
  })
);

// безопасность (мое любимое, мммм)
// cors, helmet, bcryptjs, jsonwebtoken, rateLimit,
// celebrate

// "email": "admin@mail.ru",
// "password":"123"
