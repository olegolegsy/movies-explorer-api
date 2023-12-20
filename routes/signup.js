const router = require('express').Router();
const { celebrate } = require('celebrate');
const { signupUserJoi } = require('../utils/constans');
const { addUser } = require('../controllers/users');

router.post('/', celebrate(signupUserJoi), addUser);

module.exports = router;
