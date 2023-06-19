const Card = require('../models/card');

const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(200).send(cards);
        })
};

const getCardById = (req, res) => {
    const { id } = req.params;
    return Card.findById(id)
        .then((card) => {
            return res.status(200).send(card);
        })
};

//  Подружить карточки и БД
const createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;
    return Card.create({ name, link, owner})
        .then((newCard) => {
            return res.status(201).send(newCard);
        })
};

// Лайк +
const likeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } }, 
    { new: true },
  )

// Лайк -
const dislikeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } }, 
    { new: true },
  ) 

const deleteCardById = (req, res) => {
    const { id } = req.params;
    return Card.findByIdAndDelete(id)
        .then((card) => {
            return res.status(200).send(card);
        })
};


module.exports = {
    getCards,
    getCardById,
    createCard,
    likeCard,
    dislikeCard,
    deleteCardById
}