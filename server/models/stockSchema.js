const mongoose = require('mongoose');

// Tracks each user's holdings per stock (portfolio positions)
const portfolioSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol:        { type: String, required: true, uppercase: true },
  stockName:     { type: String, default: '' },
  quantity:      { type: Number, required: true, default: 0 },
  averagePrice:  { type: Number, required: true },
  totalInvested: { type: Number, required: true },
}, { timestamps: true });

portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
