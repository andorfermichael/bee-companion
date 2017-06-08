const models  = require('../models');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');

// Save a transaction (payment)
router.post('/create', function(req, res) {
  models.PaypalTransaction.create({
    paymentId: req.body.paymentId,
    intent: req.body.intent,
    state: req.body.state,
    paymentMethod: req.body.paymentMethod,
    payerEmail: req.body.payerEmail,
    payerFirstName: req.body.payerFirstName,
    payerLastName: req.body.payerLastName,
    payerId: req.body.payerId,
    shippingAddressRecipientName: req.body.shippingAddressRecipientName,
    shippingAddressStreet: req.body.shippingAddressStreet,
    shippingAddressCadastral: req.body.shippingAddressCadastral,
    shippingAddressCity: req.body.shippingAddressCity,
    shippingAddressState: req.body.shippingAddressState,
    shippingAddressPostalCode: req.body.shippingAddressPostalCode,
    shippingAddressCountryCode: req.body.shippingAddressCountryCode,
    payerCountryCode: req.body.payerCountryCode,
    transactionTotalAmount: req.body.transactionTotalAmount,
    transactionCurrency: req.body.transactionCurrency,
    createTime: req.body.createTime,
    ReceiverId: req.body.ReceiverId,
    PayerId: req.body.PayerId
  }).then(function(paypalTransaction) {
    res.json(paypalTransaction);
  });
});

if (process.env.NODE_ENV === 'development') {
  router.use('/create', cors(corsConfig));
}

module.exports = router;
