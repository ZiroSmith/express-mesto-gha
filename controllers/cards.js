/* eslint-disable linebreak-style */
const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const DONE_CODE = 200;
const CREATE_CODE = 201;

// Найти карточки
const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(DONE_CODE).send(cards))
  .catch(next);

// Создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATE_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Необходимо заполнить все поля ввода'));
      }
      return next(err);
    });
};

// Поставить лайк
const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card Not Found');
    }
    res.status(DONE_CODE).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ValidationError('Validation Error'));
    }
    return next(err);
  });

// Убрать лайк
const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card Not Found');
    }
    res.status(DONE_CODE).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new ValidationError('Validation Error'));
    }
    return next(err);
  });

// Удалить карточку
const deleteCardById = (req, res, next) => {
  const cardId = req.params._id;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card Not Found');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не имеетек права это удалить');
      }
      res.status(DONE_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Validation Error'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCardById,
};
