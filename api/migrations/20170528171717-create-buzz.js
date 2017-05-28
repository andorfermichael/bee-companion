'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Buzzs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trigger: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mentioned: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      message: {
        allowNull: true,
        type: Sequelize.STRING
      },
      resource: {
        allowNull: true,
        type: Sequelize.STRING
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER,
        default: 0
      },
      scope: {
        allowNull: false,
        type: Sequelize.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
        default: 'public'
      },
      published: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false
      },
      archived: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false
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
    return queryInterface.dropTable('Buzzs');
  }
};
