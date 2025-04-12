const Cart = require("../models/cart_items");

const addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.products.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += 1;
      } else {
        cart.products.push({ productId });
      }
      await cart.save();
    } else {
      cart = new Cart({ userId, products: [{ productId }] });
      await cart.save();
    }

    res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToCart, getCart };
