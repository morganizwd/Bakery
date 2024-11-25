const express = require('express');
const router = express.Router();

router.use('/users', require('./userRouter'));
router.use('/reviews', require('./reviewRouter'));
router.use('/products', require('./productRouter'));
router.use('/orders', require('./orderRouter'));
router.use('/baskets', require('./basketRouter'));
router.use('/bakeries', require('./bakeryRouter'));

module.exports = router;