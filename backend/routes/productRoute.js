const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware"); 


router.get("/all-products", ProductController.getAllProducts);
router.get("/view-product/:id", ProductController.getProductById);
router.post("/add-product", auth, ProductController.addProduct);
router.get("/my-products",  ProductController.getMyProducts);
router.patch("/toggle-availability/:id",  ProductController.toggleAvailability);

module.exports = router;