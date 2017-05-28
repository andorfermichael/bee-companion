'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserPrivacies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      given_name: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      family_name: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      username: {
        allowNull: false,
        type: Sequelize.ENUM('public'),
        defaultValue: 'public'
      },
      gender: {
        allowNull: true,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'public'
      },
      description: {
        allowNull: true,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      interests: {
        allowNull: true,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      birthday: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered'),
        defaultValue: 'public'
      },
      picture: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'public'
      },
      email: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'registered'
      },
      paypal: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered'),
        defaultValue: 'registered'
      },
      phone: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'private'
      },
      authenticated: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'public'
      },
      email_verified: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'public'
      },
      street: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'donators'
      },
      street_number: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'donators'
      },
      postal_code: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        defaultValue: 'donators'
      },
      city: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered'),
        defaultValue: 'public'
      },
      country: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered'),
        defaultValue: 'public'
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
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
    return queryInterface.dropTable('UserPrivacy');
  }
};
