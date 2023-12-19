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

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const editUser = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: 'true', runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Кинозритель не найден.'));
    } else {
      return res.status(200).send(user);
    }
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(`Email: ${email} уже занят`));
    } else if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError('Кинозритель не найден.'));
    } else {
      next(err);
    }
  }
  return null;
};

const addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(`Email: ${email} уже занят`));
    } else if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
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
        },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  editUser,
  addUser,
  login,
};
