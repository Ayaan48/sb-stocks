const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['deposit', 'withdrawal', 'buy', 'sell'], required: true },
  amount:      { type: Number, required: true },
  symbol:      { type: String, default: null },
  quantity:    { type: Number, default: null },
  price:       { type: Number, default: null },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
