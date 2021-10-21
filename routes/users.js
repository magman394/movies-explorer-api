const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { editprofile, getme } = require('../controllers/users');

router.get('/api/users/me', getme);
router.patch('/api/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }).unknown(),
}), editprofile);

module.exports = router;
