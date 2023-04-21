const router = require('express').Router();
const { getUsers, updateUser } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation');

// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUsers);

// обновляет информацию о пользователе (email и имя)
router.patch('/users/me', userValidation, updateUser);

module.exports = router;
