const express = require('express');
const router  = express.Router();
const { register, login, getProfile, getAllUsers, depositFunds, withdrawFunds } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   protect, getProfile);
router.get('/all',       protect, adminOnly, getAllUsers);
router.put('/deposit',   protect, depositFunds);
router.put('/withdraw',  protect, withdrawFunds);

module.exports = router;
