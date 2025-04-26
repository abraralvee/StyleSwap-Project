const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'card'],
    required: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionDetails: {
    phoneNumber: String,
    cardNumber: String,
    cardHolderName: String,
    expiryDate: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
module.exports = Payment;