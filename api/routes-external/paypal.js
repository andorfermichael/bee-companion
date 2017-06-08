const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');

const paypal = require('paypal-rest-sdk');

if (process.env.PAYPAL_LIVE_ENABLED === 'true') {
  paypal.configure({
    'mode': 'live', // sandbox or live
    'client_id': process.env.PAYPAL_LIVE_REST_API_CLIENTID,
    'client_secret': process.env.PAYPAL_LIVE_REST_API_SECRET
  });
} else {
  paypal.configure({
    'mode': 'sandbox', // sandbox or live
    'client_id': process.env.PAYPAL_SANDBOX_REST_API_CLIENTID,
    'client_secret': process.env.PAYPAL_SANDBOX_REST_API_SECRET
  });
}

router.post('/payment/prepare', function(req, res) {
  // Define payment return and cancel urls for different environment
  let returnUrl = 'http://localhost:8000/#/home/payment/approved';
  let cancelUrl = 'http://localhost:8000/#/home/payment/cancelled';
  if (process.env.NODE_ENV === 'production') {
    returnUrl = 'https://bee-companion.com/#/home/payment/approved';
    cancelUrl = 'https://bee-companion.com/#/home/payment/cancelled';
  }

  const payload = {
    intent: 'authorize',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: returnUrl,
      cancel_url: cancelUrl
    },
    transactions: [{
      payee: {
        email: req.body.receiverEmail
      },
      item_list: {
        items: [{
          name: 'donation to beekeeper',
          sku: 'donation',
          price: req.body.amount,
          currency: 'EUR',
          quantity: 1
        }]
      },
      amount: {
        currency: 'EUR',
        total: req.body.amount
      },
      description: 'Donation'
    }]
  };

  paypal.payment.create(payload, function (error, response) {
    if (error) {
      return res.json(error.response);
    } else {
      return res.json(response);
    }
  });
});

// Get payment details
router.post('/payment/execute', function(req, res) {
  const payload = {
    payer_id: req.body.payerId
  };

  paypal.payment.execute(req.body.paymentId, payload, function (error, response) {
    if (error) {
      return res.json(error.response);
    } else {
      return res.json(response);
    }
  });
});

if (process.env.NODE_ENV === 'development') {
  router.use('/payment/prepare', cors(corsConfig));
  router.options('/payment/execute', cors(corsConfig));
  router.use('/payment/execute', cors(corsConfig));
}

module.exports = router;

