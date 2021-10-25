const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError, NotAvtorizationError, BadRequestError, ConflictError,
} = require('../middlewares/error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotAvtorizationError('Необходима авторизация');
      }
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.send({ token });
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send(
      {
        name: user.name,
        email: user.email,
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегестрирован!!'));
      } else {
        next(err);
      }
    });
};
module.exports.editprofile = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, email }, { runValidators: true, new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.getme = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({
          name: users.name,
          email: users.email,
          _id: users._id,
        });
      }
    })
    .catch(next);
};
