const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFound = require('../errors/NotFound');
const { sigupinValidation, siginupValidation } = require('../middlewares/validation');

// создаёт пользователя с переданными в теле
// email, password и name
router.post('/signup', sigupinValidation, createUser);

// проверяет переданные в теле почту и пароль
// и возвращает JWT
router.post('/signin', siginupValidation, login);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/', moviesRoutes);

router.use('*', (req, res, next) => next(new NotFound('Неправильный путь')));

module.exports = router;
