/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some-secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Нет доступа' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Нет доступа' });
  }

  req.user = payload;

  return next();
};
