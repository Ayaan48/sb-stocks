const express = require('express');
const router  = express.Router();
const { searchStocks, getStockQuote, getStockHistory, getPopularStocks } = require('../controllers/stockController');

router.get('/search',       searchStocks);
router.get('/popular',      getPopularStocks);
router.get('/:symbol',      getStockQuote);
router.get('/:symbol/history', getStockHistory);

module.exports = router;
