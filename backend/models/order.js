const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  duration: { type: Number, required: true },
  rentedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' },
});

module.exports = mongoose.model('Order', orderSchema);
