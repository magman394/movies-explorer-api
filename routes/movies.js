const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { BadRequestError } = require('../middlewares/error');
const { getmovies, createmovie, deletemovie } = require('../controllers/movies');

const validUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('можно вводить только URL');
};

router.get('/api/movies/', getmovies);
router.post('/api/movies/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validUrl),
    trailer: Joi.string().required().custom(validUrl),
    thumbnail: Joi.string().required().custom(validUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(),
}), createmovie);
router.delete('/api/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deletemovie);

module.exports = router;
