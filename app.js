// заметки для себя любимого
// не забыть удалить конслолог из порта (линтер напомнит)

// imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const helmet = require('helmet');

// vars
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;

// utils
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/signup', require('./routes/signup'));

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
// cors, helmet, bcryptjs, jsonwebtoken
// rateLimit, celebrate
