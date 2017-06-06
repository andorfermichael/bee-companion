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
      paymentId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      intent: {
        allowNull: false,
        type: Sequelize.STRING
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payerEmail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payerFirstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payerLastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payerId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressRecipientName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressStreet: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressCadastral: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressCity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressState: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressPostalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddressCountryCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payerCountryCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transactionTotalAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      transactionCurrency: {
        type: Sequelize.STRING
      },
      createTime: {
        allowNull: false,
        type: Sequelize.DATE
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
