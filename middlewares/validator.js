const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require('./error');

const linkValidator = (str) => validator.isURL(str);

const validUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('можно вводить только URL');
};
const validMoviepost = celebrate({
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
});
const validMoviedelete = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
});
const validSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string(),
  }),
});
const validSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
  }),
});
const validUserpatch = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
});
module.exports = {
  validUserpatch,
  validSignup,
  validSignin,
  validMoviedelete,
  validMoviepost,
  linkValidator,
  validUrl,
};
