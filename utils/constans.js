const { Joi } = require('celebrate');
const rateLimit = require('express-rate-limit');

// regs
const urlReg = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const mailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// user validation
const editUserJoi = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(mailReg),
  }),
};

const signinUserJoi = {
  body: Joi.object().keys({
    email: Joi.string().required().pattern(mailReg),
    password: Joi.string().required(),
  }),
};

const signupUserJoi = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(mailReg),
    password: Joi.string().required(),
  }),
};

// movie validation
const postMovieJoi = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    year: Joi.string().required(),
    image: Joi.string().required().pattern(urlReg),
    trailerLink: Joi.string().required().pattern(urlReg),
    thumbnail: Joi.string().required().pattern(urlReg),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const delMovieJoi = {
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
};

// the rest
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  urlReg,
  mailReg,
  editUserJoi,
  signinUserJoi,
  signupUserJoi,
  postMovieJoi,
  delMovieJoi,
  limiter,
};
