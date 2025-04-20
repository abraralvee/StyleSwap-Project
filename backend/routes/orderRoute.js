const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/orderController');

router.post('/place', placeOrder);
router.get('/user/:userId', getUserOrders);

module.exports = router;
