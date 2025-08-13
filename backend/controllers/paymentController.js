const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const { sendPaymentConfirmationEmail, sendOwnerNotificationEmail } = require('../utils/emailService');

// Process payment for an order
const processPayment = async (req, res) => {
  const { userId, orderId, amount, paymentMethod, paymentDetails } = req.body;

  try {
    const orders = await Order.find({ user: userId, status: 'Pending' })
      .populate('product')
      .populate('owner')
      .populate('user');

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No pending orders found' });
    }

    const processedOrders = [];

    for (const order of orders) {
      const product = order.product;
      const owner = order.owner;
      const user = order.user;

      // Update order with payment info using the total amount sent from frontend
      order.paymentMethod = paymentMethod;
      order.paymentDetails = {
        amount: amount, // total amount including delivery + dry cleaning already calculated
        method: paymentMethod,
        date: new Date(),
        reference:
          paymentMethod === 'Card'
            ? `XXXX-XXXX-XXXX-${paymentDetails.cardNumber.slice(-4)}`
            : paymentDetails.phoneNumber,
      };

      order.status = 'Completed';
      await order.save();
      processedOrders.push(order);

      // Update product availability
      const rentDays = parseInt(product.duration.split(" ")[0]) || 7;
      product.available = false;
      product.rentedUntil = new Date(Date.now() + rentDays * 24 * 60 * 60 * 1000);
      await product.save();

      // Send emails
      await sendPaymentConfirmationEmail(user, order, order.paymentDetails);
      await sendOwnerNotificationEmail(owner, order, user);
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      totalAmount: amount,
      orderDetails: processedOrders.map(order => ({
        orderId: order._id,
        product: order.product.name,
        price: order.paymentDetails.amount,
        duration: order.duration,
        rentedUntil: order.product.rentedUntil
      }))
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment', error: error.message });
  }
};



// Get payment details for an order
const getPaymentDetails = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findById(orderId);
    
    if (!order || !order.paymentDetails) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment details not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      paymentDetails: order.paymentDetails
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get payment details',
      error: error.message
    });
  }
};

module.exports = {
  processPayment,
  getPaymentDetails
};