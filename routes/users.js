const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUserById, updateUserAvatarById, deleteUserById } = require('../controllers/users')


router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.patch('/users/:id', updateUserById);

router.patch('/users/:id/avatar', updateUserAvatarById);


module.exports = router;