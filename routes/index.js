const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');


router.get('/', (req, res) => {
    res.send('Hello world!')
  });

router.use(userRoutes);
router.use(cardRoutes);

module.exports = router;