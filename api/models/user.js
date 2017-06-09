'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    auth_user_id: DataTypes.STRING,
    given_name: DataTypes.STRING,
    family_name: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    interests: DataTypes.STRING,
    birthday: DataTypes.DATE,
    role: DataTypes.ENUM('Admin', 'Supporter', 'Beekeeper'),
    gender: DataTypes.ENUM('male', 'female'),
    picture: DataTypes.STRING,
    email: DataTypes.STRING,
    paypal: DataTypes.STRING,
    phone: DataTypes.STRING,
    authenticated: DataTypes.BOOLEAN,
    email_verified: DataTypes.BOOLEAN,
    street: DataTypes.STRING,
    street_number: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    geographicLocation: DataTypes.GEOMETRY
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.Privacy = models.User.hasOne(models.UserPrivacy);
        models.User.Buzzes = models.User.hasMany(models.Buzz, {foreignKey: 'UserId'});
        models.User.Mentions = models.User.hasMany(models.Buzz, {foreignKey: 'mentionId'});
        models.User.TransactionsIn = models.User.hasMany(models.PaypalTransaction, {foreignKey: 'receiverId'});
        models.User.TransactionsOut = models.User.hasMany(models.PaypalTransaction, {foreignKey: 'senderId'});
        models.User.Likes = models.User.hasMany(models.Like, {foreignKey: 'UserId'});
      }
    }
  });
  return User;
};
