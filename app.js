// заметки для себя любимого
// не забыть удалить конслолог из порта (линтер напомнит)

// imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// vars
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;

// action
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL).then(() =>
  app.listen(PORT, () => {
    console.log(`работаем на ${PORT} порту`);
  })
);
