const router = require('express').Router();
const { createMovies, getMovies, deleteMovies } = require('../controllers/movies');
const { movieIdValidation, moviesValidation } = require('../middlewares/validation');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
router.post('/', moviesValidation, createMovies);

// удаляет сохранённый фильм по id
router.delete('/:movieId', movieIdValidation, deleteMovies);

module.exports = router;
