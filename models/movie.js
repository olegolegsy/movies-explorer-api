const mongoose = require('mongoose');
const { urlReg } = require('../utils/constans');

const userMovie = new mongoose.Schema(
  {
    country: { type: String, required: [true, 'Незаполнено поле country'] },
    director: { type: String, required: [true, 'Незаполнено поле director'] },
    duration: { type: Number, required: [true, 'Незаполнено поле duration'] },
    year: { type: String, required: [true, 'Незаполнено поле year'] },
    description: {
      type: String,
      required: [true, 'Незаполнено поле description '],
    },
    image: {
      type: String,
      required: [true, 'Незаполнено поле image'],
      validate: {
        validator(url) {
          return urlReg.test(url);
        },
        message: 'Введите URL в поле image',
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Незаполнено поле trailerLink'],
      validate: {
        validator(url) {
          return urlReg.test(url);
        },
        message: 'Введите URL в поле trailerLink',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Незаполнено поле thumbnail'],
      validate: {
        validator(url) {
          return urlReg.test(url);
        },
        message: 'Введите URL в поле thumbnail',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: [true, 'Незаполнено поле movieId'],
    },
    nameRU: {
      type: String,
      required: [true, 'Незаполнено поле nameRU'],
    },
    nameEN: {
      type: String,
      required: [true, 'Незаполнено поле nameEN'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', userMovie);
