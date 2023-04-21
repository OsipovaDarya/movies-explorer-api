const router = require('express').Router();
const { createMovies, getMovies, deleteMovies } = require('../controllers/movies');
const { movieIdValidation, moviesValidation } = require('../middlewares/validation');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
router.post('/movies', moviesValidation, createMovies);

// удаляет сохранённый фильм по id
router.delete('/movies/:movieId', movieIdValidation, deleteMovies);

module.exports = router;
