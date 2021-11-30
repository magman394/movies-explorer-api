const mongoose = require('mongoose');
const { linkValidator } = require('../middlewares/validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'Заполнитне поле с картинкой'],
    validate: [linkValidator, 'Нужно указать ссылку на картинку'],
  },
  trailer: {
    type: String,
    required: true,
    validate: [linkValidator, 'Нужно указать ссылку на трейлер'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [linkValidator, 'Нужно указать ссылку на миниатюру'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'owner',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  isLiked: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
