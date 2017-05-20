'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('PaypalTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      responseEnvelopeTimestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      responseEnvelopeAck: {
        allowNull: false,
        type: Sequelize.STRING
      },
      responseEnvelopeCorrelationId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      responseEnvelopeBuild: {
        allowNull: false,
        type: Sequelize.STRING
      },
      currencyCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transactionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transactionStatus: {
        allowNull: false,
        type: Sequelize.STRING
      },
      receiverAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      receiverEmail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      receiverPrimary: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      receiverPaymentType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      receiverAccountId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      refundedAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      pendingRefund: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      senderTransactionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      senderTransactionStatus: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payKey: {
        type: Sequelize.STRING
      },
      feesPayer: {
        allowNull: false,
        type: Sequelize.STRING
      },
      senderEmail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      senderAccountId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('PaypalTransactions');
  }
};
