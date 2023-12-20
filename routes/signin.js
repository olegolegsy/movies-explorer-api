const router = require('express').Router();
const { celebrate } = require('celebrate');
const { signinUserJoi } = require('../utils/constans');
const { login } = require('../controllers/users');

router.post('/', celebrate(signinUserJoi), login);

module.exports = router;
