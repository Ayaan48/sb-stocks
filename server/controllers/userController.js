const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User        = require('../models/userModel');
const Transaction = require('../models/transactionModel');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Username or email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({
      _id: user._id, username: user.username, email: user.email,
      balance: user.balance, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id, username: user.username, email: user.email,
      balance: user.balance, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const depositFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: amount } },
      { new: true }
    ).select('-password');

    await Transaction.create({
      userId: req.user._id, type: 'deposit',
      amount, description: `Deposited $${amount}`,
    });

    res.json({ balance: user.balance, message: `$${amount} deposited successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    if (req.user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: -amount } },
      { new: true }
    ).select('-password');

    await Transaction.create({
      userId: req.user._id, type: 'withdrawal',
      amount, description: `Withdrew $${amount}`,
    });

    res.json({ balance: user.balance, message: `$${amount} withdrawn successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, getAllUsers, depositFunds, withdrawFunds };
