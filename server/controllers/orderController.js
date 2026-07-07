const User        = require('../models/userModel');
const Order       = require('../models/orderSchema');
const Transaction = require('../models/transactionModel');
const Portfolio   = require('../models/stockSchema');

const buyStock = async (req, res) => {
  try {
    const { symbol, stockName, quantity, price } = req.body;
    if (!symbol || !quantity || !price)
      return res.status(400).json({ message: 'Symbol, quantity, and price are required' });

    const totalAmount = parseFloat((quantity * price).toFixed(2));
    const user = await User.findById(req.user._id);

    if (user.balance < totalAmount)
      return res.status(400).json({ message: 'Insufficient balance' });

    // Deduct balance
    user.balance = parseFloat((user.balance - totalAmount).toFixed(2));
    await user.save();

    // Create order record
    const order = await Order.create({
      userId: req.user._id, symbol: symbol.toUpperCase(),
      stockName, type: 'buy', quantity, price, totalAmount,
    });

    // Update or create portfolio position
    const existing = await Portfolio.findOne({ userId: req.user._id, symbol: symbol.toUpperCase() });
    if (existing) {
      const newQty   = existing.quantity + quantity;
      const newTotal = parseFloat((existing.totalInvested + totalAmount).toFixed(2));
      existing.quantity      = newQty;
      existing.totalInvested = newTotal;
      existing.averagePrice  = parseFloat((newTotal / newQty).toFixed(4));
      existing.stockName     = stockName || existing.stockName;
      await existing.save();
    } else {
      await Portfolio.create({
        userId: req.user._id, symbol: symbol.toUpperCase(),
        stockName, quantity, averagePrice: price, totalInvested: totalAmount,
      });
    }

    // Log transaction
    await Transaction.create({
      userId: req.user._id, type: 'buy', amount: totalAmount,
      symbol: symbol.toUpperCase(), quantity, price,
      description: `Bought ${quantity} shares of ${symbol.toUpperCase()} at $${price}`,
    });

    res.status(201).json({ order, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { symbol, stockName, quantity, price } = req.body;
    if (!symbol || !quantity || !price)
      return res.status(400).json({ message: 'Symbol, quantity, and price are required' });

    const position = await Portfolio.findOne({ userId: req.user._id, symbol: symbol.toUpperCase() });
    if (!position || position.quantity < quantity)
      return res.status(400).json({ message: 'Insufficient shares to sell' });

    const totalAmount = parseFloat((quantity * price).toFixed(2));
    const user = await User.findById(req.user._id);

    // Credit balance
    user.balance = parseFloat((user.balance + totalAmount).toFixed(2));
    await user.save();

    // Create order record
    const order = await Order.create({
      userId: req.user._id, symbol: symbol.toUpperCase(),
      stockName: stockName || position.stockName, type: 'sell',
      quantity, price, totalAmount,
    });

    // Update portfolio
    const newQty = position.quantity - quantity;
    if (newQty === 0) {
      await Portfolio.deleteOne({ _id: position._id });
    } else {
      position.quantity = newQty;
      position.totalInvested = parseFloat((position.averagePrice * newQty).toFixed(2));
      await position.save();
    }

    // Log transaction
    await Transaction.create({
      userId: req.user._id, type: 'sell', amount: totalAmount,
      symbol: symbol.toUpperCase(), quantity, price,
      description: `Sold ${quantity} shares of ${symbol.toUpperCase()} at $${price}`,
    });

    res.status(201).json({ order, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user._id });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { buyStock, sellStock, getMyOrders, getAllOrders, getMyPortfolio };
