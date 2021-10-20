const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { editprofile, getme } = require('../controllers/users');

router.get('/me', getme);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
  }),
}), editprofile);


module.exports = router;
