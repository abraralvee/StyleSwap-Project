const Order = require('../models/order');
const Product = require('../models/Product');

const placeOrder = async (req, res) => {
  const { userId, productId, duration } = req.body;

  if (!userId || !productId || !duration) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const order = new Order({
      user: userId,
      product: productId,
      duration,
      rentedAt: new Date(),
      status: 'Processing',
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = { placeOrder, getUserOrders };
