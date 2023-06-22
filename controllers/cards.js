const Card = require('../models/card');
const { DONE_CODE,
        CREATE_CODE, 
        BAD_REQUEST_CODE, 
        NOT_FOUND_CODE, 
        GLOBAL_ERROR_SERVER } = require('../utils/constants');

// Найти карточки
const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(DONE_CODE).send(cards);
        })
        .catch((err) => {
            return res.status(GLOBAL_ERROR_SERVER).send({ message: "Server Error" })
        })
};

// Создать карточку
const createCard = (req, res) => {
    const { name, link } = req.body;
    return Card.create({ name, link, owner: req.user._id })
        .then((card) => {
            return res.status(CREATE_CODE).send({ data: card });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(BAD_REQUEST_CODE).send({ message: "Validation Error" })
                return;
            } else {
                res.status(GLOBAL_ERROR_SERVER).send({ message: "Server Error" });
                return;
            }
        })
};

// Поставить лайк
const likeCard = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params._id, 
        { $addToSet: { likes: req.user._id } }, 
        { new: true },
    )
    .orFail(() => new Error('Not_Found'))
    .then((card) => {
        return res.status(DONE_CODE).send({ data: card });
    })
    .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
        } else if (err.message === 'Not_Found') {
          res.status(NOT_FOUND_CODE).send({ message: 'Card Not Found' });
        } else {
          res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
        }
      });
};

// Убрать лайк
const dislikeCard = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params._id, 
        { $pull: { likes: req.user._id } }, 
        { new: true },
    )
    .orFail(() => new Error('Not_Found'))
    .then((card) => {
        return res.status(DONE_CODE).send({ data: card });
    })
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
          } else if (err.message === 'Not_Found') {
          res.status(NOT_FOUND_CODE).send({ message: 'Card Not Found' });
        } else {
          res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
        }
      });
};

// Удалить карточку
const deleteCardById = (req, res) => {
    const cardId = req.params._id;
    return Card.findByIdAndRemove(cardId)
        .orFail(() => new Error('Not_Found'))
        .then((card) => {
            return res.status(DONE_CODE).send({ data: card });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: 'Validation Error' });
              } else if (err.message === 'Not_Found') {
              res.status(NOT_FOUND_CODE).send({ message: 'Card Not Found' });
            } else {
              res.status(GLOBAL_ERROR_SERVER).send({ message: 'Server Error' });
            }
          });
};


module.exports = {
    getCards,
    createCard,
    likeCard,
    dislikeCard,
    deleteCardById
}