const Product = require("../models/product");

// Get all products (for marketplace view)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }) // newest first
      .populate("ownerId", "name email");

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    if (req.user.isBanned) {
      return res.status(403).json({ success: false, message: "You are banned and cannot add products" });
    }

    const { name, size, color, gender, condition, image, price, duration } = req.body;

    if (!name || !size || !color || !gender || !condition || !image || !price || !duration) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      size,
      color,
      gender,
      condition,
      image,
      price,
      duration,
      available: true,
      ownerId: req.user._id,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get products owned by the current user (for profile)
const getMyProducts = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ success: false, message: "userId query is required" });

    const products = await Product.find({ ownerId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle availability (pass userId to check ownership)
const toggleAvailability = async (req, res) => {
  try {
    const { userId } = req.body; // ownerId must be passed
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.ownerId.toString() !== userId) return res.status(403).json({ success: false, message: "Not authorized" });

    product.available = !product.available;
    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProductById,
  getAllProducts,
  addProduct,
  getMyProducts,
  toggleAvailability,
};
