const express = require('express');
const router = express.Router();
const { processPayment, getPaymentHistory } = require('../controllers/paymentController');

router.post('/process', processPayment);
router.get('/history/:userId', getPaymentHistory);

module.exports = router;