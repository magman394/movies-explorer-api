const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { NotAvtorizationError } = require('../middlewares/error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Email введен не правильно'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAvtorizationError('Логин или пароль указаны неверно');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAvtorizationError('Логин или пароль указаны неверно');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
