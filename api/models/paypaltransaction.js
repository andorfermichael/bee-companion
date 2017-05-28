'use strict';
module.exports = function(sequelize, DataTypes) {
  const PaypalTransaction = sequelize.define('PaypalTransaction', {
    responseEnvelopeTimestamp: DataTypes.DATE,
    responseEnvelopeAck: DataTypes.STRING,
    responseEnvelopeCorrelationId: DataTypes.STRING,
    responseEnvelopeBuild: DataTypes.STRING,
    currencyCode: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    transactionStatus: DataTypes.STRING,
    receiverAmount: DataTypes.DECIMAL,
    receiverEmail: DataTypes.STRING,
    receiverPrimary: DataTypes.BOOLEAN,
    receiverPaymentType: DataTypes.STRING,
    receiverAccountId: DataTypes.STRING,
    refundedAmount: DataTypes.DECIMAL,
    pendingRefund: DataTypes.BOOLEAN,
    senderTransactionId: DataTypes.STRING,
    senderTransactionStatus: DataTypes.STRING,
    status: DataTypes.STRING,
    payKey: DataTypes.STRING,
    feesPayer: DataTypes.STRING,
    senderEmail: DataTypes.STRING,
    senderAccountId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        PaypalTransaction.User = models.PaypalTransaction.belongsTo(models.User);
      }
    }
  });
  return PaypalTransaction;
};
