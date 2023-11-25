const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');
const CastError = require('../errors/CastError');
const DuplicationError = require('../errors/DuplicationError');

module.exports.getUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      if (user.email === email) {
        throw new DuplicationError('Этот email уже используется');
      }
      User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((users) => res.send(users))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new CastError('Ошибка проверки данных'));
          } else {
            next(error);
          }
        });
    }).catch((error) => {
      if (error.name === 'DuplicationError') {
        next(new DuplicationError('Этот email уже используется'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictingRequest('Такой пользователь уже существует'));
        return;
      }
      if (error.name === 'ValidationError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => {
      next(error);
    });
};
