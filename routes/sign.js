const router = require('express').Router();
const { validSignin, validSignup } = require('../middlewares/validator');
const { login, createUser } = require('../controllers/users');

router.post('/api/signin', validSignin, login);
router.post('/api/signup', validSignup, createUser);

module.exports = router;
