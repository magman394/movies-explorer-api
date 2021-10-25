const router = require('express').Router();
const { validUserpatch } = require('../middlewares/validator');
const { editprofile, getme } = require('../controllers/users');

router.get('/api/users/me', getme);
router.patch('/api/users/me', validUserpatch, editprofile);

module.exports = router;
