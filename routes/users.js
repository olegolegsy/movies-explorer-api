const router = require('express').Router();
const { editUser, getUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', editUser);

module.exports = router;
