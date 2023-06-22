/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  getCards, createCard, likeCard, dislikeCard, deleteCardById,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.put('/cards/:_id/likes', likeCard);

router.delete('/cards/:_id/likes', dislikeCard);

router.delete('/cards/:_id', deleteCardById);

module.exports = router;
