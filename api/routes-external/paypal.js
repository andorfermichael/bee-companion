const Paypal = require('paypal-adaptive');

const express = require('express');
const router = express.Router();

const paypalSdk = new Paypal({
  userId:    process.env.PAYPAL_SANDBOX_API_USERID,
  password:  process.env.PAYPAL_SANDBOX_API_PASSWORD,
  signature: process.env.PAYPAL_SANDBOX_API_SIGNATURE,
  sandbox:   true // Defaults to false
});

// Execute payment
router.post('/paypal/pay', function(req, res) {
  let payload = {
    requestEnvelope: {
      errorLanguage:  'en_US'
    },
    actionType:     'PAY',
    currencyCode:   'EUR',
    cancelUrl:      'http://localhost:3000/api/paypal/pay/cancelled',
    returnUrl:      'http://localhost:3000/api/paypal/pay/approved',
    receiverList: {
      receiver: [
        {
          email:  req.body.receiverMail,
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

// Payment has been approved
router.get('/paypal/pay/approved', function(req, res) {
  res.redirect('http://localhost:8000/#/home');
});

// Payment has been cancelled
router.get('/paypal/pay/cancelled', function(req, res) {
  res.redirect('http://localhost:8000/#/home');
});

module.exports = router;

