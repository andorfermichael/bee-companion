const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');

const Paypal = require('paypal-adaptive');

const paypalSdk = new Paypal({
  userId:    process.env.PAYPAL_SANDBOX_API_USERID,
  password:  process.env.PAYPAL_SANDBOX_API_PASSWORD,
  signature: process.env.PAYPAL_SANDBOX_API_SIGNATURE,
  sandbox:   true // Defaults to false
});

// Execute payment
router.use('/pay', cors(corsConfig));
router.post('/pay', function(req, res) {
  let payload = {
    requestEnvelope: {
      errorLanguage:  'en_US'
    },
    actionType:     'PAY',
    currencyCode:   'EUR',
    cancelUrl:      'http://localhost:8000/#/home/payment/cancelled',
    returnUrl:      'http://localhost:8000/#/home/payment/approved',
    receiverList: {
      receiver: [
        {
          email:  req.body.receiverEmail,
          amount: req.body.amount
        }
      ]
    }
  };

  paypalSdk.pay(payload, function (err, response) {
    if (err) {
      return res.json(err);
    } else {
      // Response will have the original Paypal API response
      return res.json(response)
    }
  });
});

// Get payment details
router.use('/pay/payment-details', cors(corsConfig));
router.post('/pay/payment-details', function(req, res) {
  let payload = {
    payKey: req.body.payKey
  };

  paypalSdk.paymentDetails(payload, function (err, response) {
    if (err) {
      return res.json(err);
    } else {
      // Payments details for this payKey
      return res.json(response)
    }
  });
});

module.exports = router;

