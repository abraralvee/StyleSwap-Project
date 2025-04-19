const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "No products found!" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProductById,
  getAllProducts,
  addProduct,
};
