/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  getUsers, getMyInfo, getUserById, updateUserById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getMyInfo);

router.get('/users/:id', getUserById);

router.patch('/users/me', updateUserById);

router.patch('/users/me/avatar', updateUserAvatarById);

module.exports = router;
