const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");

router.post("/add", CartController.addToCart);
router.get("/:userId", CartController.getCart);

module.exports = router;
