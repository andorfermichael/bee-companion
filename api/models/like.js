'use strict';
module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define('Like', {
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Like.likedBy = models.Like.belongsTo(models.User, {as: 'UserId'});
        models.Like.Buzz = models.Like.belongsTo(models.Buzz, {as: 'BuzzId'});     
      }
    }
  });
  return Like;
};
