'use strict';
module.exports = function(sequelize, DataTypes) {
  const PaypalTransaction = sequelize.define('PaypalTransaction', {
    paymentId: DataTypes.STRING,
    intent: DataTypes.STRING,
    state: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    payerEmail: DataTypes.STRING,
    payerFirstName: DataTypes.STRING,
    payerLastName: DataTypes.STRING,
    payerId: DataTypes.STRING,
    shippingAddressRecipientName: DataTypes.STRING,
    shippingAddressStreet: DataTypes.STRING,
    shippingAddressCadastral: DataTypes.STRING,
    shippingAddressCity: DataTypes.STRING,
    shippingAddressState: DataTypes.DECIMAL,
    shippingAddressPostalCode: DataTypes.BOOLEAN,
    shippingAddressCountryCode: DataTypes.STRING,
    payerCountryCode: DataTypes.STRING,
    transactionTotalAmount: DataTypes.DECIMAL,
    transactionCurrency: DataTypes.STRING,
    createTime: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        PaypalTransaction.User = models.PaypalTransaction.belongsTo(models.User, {as: 'ReceiverId'});
        PaypalTransaction.User = models.PaypalTransaction.belongsTo(models.User, {as: 'PayerId'});
      }
    }
  });
  return PaypalTransaction;
};
