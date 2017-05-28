'use strict';
module.exports = function(sequelize, DataTypes) {
  const UserPrivacy = sequelize.define('UserPrivacy', {
    given_name: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    family_name: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    username: DataTypes.ENUM('public'),
    gender: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    description: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    interests: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    birthday: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    role: DataTypes.ENUM('public', 'registered'),
    picture: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    email: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    paypal: DataTypes.ENUM('public', 'registered'),
    phone: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    authenticated: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    email_verified: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    street: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    street_number: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    postal_code: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    city: DataTypes.ENUM('public', 'registered'),
    country: DataTypes.ENUM('public', 'registered')
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        UserPrivacy.User = models.UserPrivacy.belongsTo(models.User);
      }
    }
  });
  return UserPrivacy;
};
