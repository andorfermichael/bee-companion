'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      given_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      family_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      interests: {
        allowNull: true,
        type: Sequelize.STRING
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATE
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('Admin', 'Supporter', 'Beekeeper')
      },
      picture: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paypal: {
        allowNull: true,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING
      },
      authenticated: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      email_verified: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      street: {
        allowNull: true,
        type: Sequelize.STRING
      },
      street_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      postal_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country: {
        allowNull: true,
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
    return queryInterface.dropTable('User');
  }
};
