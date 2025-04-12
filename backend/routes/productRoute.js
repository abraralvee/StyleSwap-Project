const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");

router.get("/all-products", ProductController.getAllProducts);
router.get("/view-product/:id", ProductController.getProductById);
router.post("/add-product", ProductController.addProduct);

module.exports = router;
