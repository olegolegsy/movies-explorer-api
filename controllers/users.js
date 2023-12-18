// imports
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/user');

// vars
const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// PLAN
// getUser :200
// patchUser :400, 404 добаавляется проверка на совпадающий mail (conflict error)
// signin (login) :200
// signup (addUser) :400

// .orFail(new Error('NotFound')) - мб заменить строку на константу
// проверить тексты ошибок

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const editUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: 'true', runValidators: true }
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(`Этот email: ${email} уже занят`));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь не найден.`));
      } else {
        next(err);
      }
    });
};

const addUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      email,
      password: hash,
    })
      .then(({ name, _id, email }) =>
        res.status(201).send({
          name,
          _id,
          email,
        })
      )
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(`Этот email: ${email} уже занят`));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else {
          next(err);
        }
      })
  );
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'MY-MEGA-SECRET-KEY',
        {
          expiresIn: '30d',
        }
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = { getUser, editUser, addUser, login };
