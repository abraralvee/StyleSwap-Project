const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');


router.post('/place-order', OrderController.placeOrderFromCart);


router.get('/:userId', OrderController.getUserOrders);
router.get('/owner/:ownerId', OrderController.getOrdersForOwner);
router.put('/update-status', OrderController.updateOrderStatus);
router.put('/status/:orderId', OrderController.updateOrderStatus);


module.exports = router;
