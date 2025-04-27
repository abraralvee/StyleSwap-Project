



const Payment = require('../models/payment');
const Order = require('../models/order');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPaymentConfirmationEmail = async (user, payment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Payment Confirmation - StyleSwap',
    html: `
      <h1>Payment Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Your payment has been successfully processed.</p>
      <p>Payment Details:</p>
      <ul>
        <li>Amount: ৳${payment.amount}</li>
        <li>Payment Method: ${payment.paymentMethod}</li>
        <li>Transaction ID: ${payment.paymentId}</li>
        <li>Date: ${new Date(payment.createdAt).toLocaleString()}</li>
      </ul>
      <p>Thank you for shopping with StyleSwap!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const processPayment = async (req, res) => {
  try {
    const { userId, orderId, amount, paymentMethod, transactionDetails } = req.body;

    // Validate user and order
    const user = await User.findById(userId);
    const order = await Order.findById(orderId);

    if (!user || !order) {
      return res.status(404).json({ success: false, message: 'User or order not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId,
      orderId,
      amount,
      paymentMethod,
      paymentId: uuidv4(), // Generate unique payment ID
      status: 'completed', // Simulate successful payment
      transactionDetails
    });

    await payment.save();

    // Update order status
    order.status = 'Paid';
    await order.save();

    // Send confirmation email
    await sendPaymentConfirmationEmail(user, payment);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};

module.exports = {
  processPayment,
  getPaymentHistory
};