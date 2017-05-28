'use strict';
module.exports = function(sequelize, DataTypes) {
  const Buzz = sequelize.define('Buzz', {
    trigger: DataTypes.STRING,
    mentioned: DataTypes.ARRAY(DataTypes.STRING),
    message: DataTypes.STRING,
    resource: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    scope: DataTypes.ENUM('public', 'registered', 'donators', 'beekeeper', 'supporter', 'private'),
    published: DataTypes.BOOLEAN,
    archived: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Buzz.User = models.Buzz.belongsTo(models.User);
      }
    }
  });
  return Buzz;
};
