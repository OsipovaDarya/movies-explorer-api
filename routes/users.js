const router = require('express').Router();
const { getUsers, updateUser } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUsers);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', userValidation, updateUser);

module.exports = router;
