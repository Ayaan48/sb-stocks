const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol:      { type: String, required: true, uppercase: true },
  stockName:   { type: String, default: '' },
  type:        { type: String, enum: ['buy', 'sell'], required: true },
  quantity:    { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
