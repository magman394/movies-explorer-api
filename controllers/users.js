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
  User.findOne({ email: req.body.email })
    .then((users) => {
      if (users) {
        throw new ConflictError('Пользователь с таким email уже зарегестрирован!!');
      } else {
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
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
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
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
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
        res.status(200).send({
          name: users.name,
          email: users.email,
          _id: users._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
