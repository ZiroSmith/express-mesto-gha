const Card = require('../models/card');

// Найти карточки
const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(200).send(cards);
        })
};

// Создать карточку
const createCard = (req, res) => {
    const { name, link } = req.body;
    return Card.create({ name, link, owner: req.user._id })
        .then((card) => {
            return res.status(201).send({ data: card });
        })
};

// Поставить лайк
const likeCard = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params._id, 
        { $addToSet: { likes: req.user._id } }, 
        { new: true },
    )
    .then((card) => {
        return res.status(200).send({ data: card });
    })
};

// Убрать лайк
const dislikeCard = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params._id, 
        { $pull: { likes: req.user._id } }, 
        { new: true },
    )
    .then((card) => {
        return res.status(200).send({ data: card });
    })
};

// Удалить карточку
const deleteCardById = (req, res) => {
    const cardId = req.params._id;
    return Card.findByIdAndRemove(cardId)
        .then((card) => {
            return res.status(200).send({ data: card });
        })
};


module.exports = {
    getCards,
    createCard,
    likeCard,
    dislikeCard,
    deleteCardById
}