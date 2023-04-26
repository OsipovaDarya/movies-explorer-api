const Movies = require('../models/movie');
const NotFound = require('../errors/NotFound');
const CastError = require('../errors/CastError');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFound('Фильмы не найдены');
    })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movies) => res.send(movies))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Нельзя удалять чужие фильмы');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movies.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new Forbidden('Нельзя удалить чужой фильм');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};
