'use strict';
module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define('Like', {
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Like.likedBy = models.Like.belongsTo(models.User, {as: 'likedBy'});
        models.Like.Buzz = models.Like.belongsTo(models.Buzz, {as: 'Buzz'});
      }
    }
  });
  return Like;
};
