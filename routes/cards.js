const router = require('express').Router();
const { getCards, getCardById, createCard, likeCard, dislikeCard, deleteCardById } = require('../controllers/cards')


router.get('/cards', getCards);

router.get('/cards/:cardId', getCardById);

router.post('/cards', createCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

router.delete('/cards/:cardId', deleteCardById);


module.exports = router;