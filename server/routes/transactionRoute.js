const express = require('express');
const router  = express.Router();
const { getMyTransactions, getAllTransactions } = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/my',  protect, getMyTransactions);
router.get('/all', protect, adminOnly, getAllTransactions);

module.exports = router;
