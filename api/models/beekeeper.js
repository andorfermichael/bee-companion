'use strict';
module.exports = function(sequelize, DataTypes) {
  var Beekeeper = sequelize.define('Beekeeper', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Beekeeper;
};