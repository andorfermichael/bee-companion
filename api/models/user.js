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
    country: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.Privacy = models.User.hasOne(models.UserPrivacy);
        models.User.Buzzes = models.User.hasMany(models.Buzz);
      }
    }
  });
  return User;
};
