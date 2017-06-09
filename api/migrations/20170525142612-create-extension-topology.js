'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;')
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP EXTENSION postgis_topology;')
  }
};
