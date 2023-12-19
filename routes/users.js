const router = require('express').Router();
const { celebrate } = require('celebrate');
const { editUserJoi } = require('../utils/constans');
const { editUser, getUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate(editUserJoi), editUser);

module.exports = router;
