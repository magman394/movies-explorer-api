const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { editprofile, getme } = require('../controllers/users');

router.get('/users/me', getme);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }).unknown(),
}), editprofile);

module.exports = router;
