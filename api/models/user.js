'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Supporter', 'Beekeeper'),
    picture: DataTypes.STRING,
    email: DataTypes.STRING,
    paypalId: DataTypes.STRING,
    phone: DataTypes.STRING,
    authenticated: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    street: DataTypes.STRING,
    streetNumber: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
