const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const addMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    description,
    year,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const delMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;

  Movie.findById(movieId)
    .orFail(new NotFoundError('Нет такой киноленты'))
    .then((movie) => {
      if (movie.owner.equals(_id)) {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send({ message: 'кинолента удалена' }))
          .catch((err) => {
            next(err);
          });
      } else {
        next(new ForbiddenError('чужая кинолента'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('такой киноленты нет'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный id киноленты'));
      } else {
        next(err);
      }
    });
};

module.exports = { addMovie, delMovie, getMovies };
