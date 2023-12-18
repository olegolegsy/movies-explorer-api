const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'MY-MEGA-SECRET-KEY' } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Авторизуйся!'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'MY-MEGA-SECRET-KEY'
    );
  } catch (err) {
    next(new UnauthorizedError('Авторизуйся!'));
  }

  req.user = payload;
  next();
};
