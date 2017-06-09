'use strict';
module.exports = function(sequelize, DataTypes) {
  const Buzz = sequelize.define('Buzz', {
    trigger: DataTypes.STRING,
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
        models.Buzz.owner = models.Buzz.belongsTo(models.User, {as: 'OwnerId', foreignKey: 'id'});
        models.Buzz.mentioned = models.Buzz.belongsTo(models.User, {as: 'MentionId', foreignKey: 'id'});     
      }
    }
  });
  return Buzz;
};
