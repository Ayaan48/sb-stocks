const express = require('express');
const router  = express.Router();
const { buyStock, sellStock, getMyOrders, getAllOrders, getMyPortfolio } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/buy',       protect, buyStock);
router.post('/sell',      protect, sellStock);
router.get('/my',         protect, getMyOrders);
router.get('/portfolio',  protect, getMyPortfolio);
router.get('/all',        protect, adminOnly, getAllOrders);

module.exports = router;
