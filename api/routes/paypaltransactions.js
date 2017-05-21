const models  = require('../models');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');

// Save a transaction (payment)
router.use('/create', cors(corsConfig));
router.post('/create', cors(), function(req, res) {
  models.PaypalTransaction.create({
    responseEnvelopeTimestamp: req.body.responseEnvelopeTimestamp,
    responseEnvelopeAck: req.body.responseEnvelopeAck,
    responseEnvelopeCorrelationId: req.body.responseEnvelopeCorrelationId,
    responseEnvelopeBuild: req.body.responseEnvelopeBuild,
    currencyCode: req.body.currencyCode,
    transactionId: req.body.transactionId,
    transactionStatus: req.body.transactionStatus,
    receiverAmount: req.body.receiverAmount,
    receiverEmail: req.body.receiverEmail,
    receiverPrimary: req.body.receiverPrimary,
    receiverPaymentType: req.body.receiverPaymentType,
    receiverAccountId: req.body.receiverAccountId,
    refundedAmount: req.body.refundedAmount,
    pendingRefund: req.body.pendingRefund,
    senderTransactionId: req.body.senderTransactionId,
    senderTransactionStatus: req.body.senderTransactionStatus,
    status: req.body.status,
    payKey: req.body.payKey,
    actionType: req.body.actionType,
    feesPayer: req.body.feesPayer,
    senderEmail: req.body.senderEmail,
    senderAccountId: req.body.senderAccountId
  }).then(function(paypalTransaction) {
    res.json(paypalTransaction);
  });
});

module.exports = router;
