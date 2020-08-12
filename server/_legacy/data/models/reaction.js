module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('reaction', {
    upvotes: {
      type: DataTypes.INTEGER,
    },
    downvotes: {
      type: DataTypes.INTEGER,
    },
  });

  Reaction.associate = (models) => {
    Reaction.belongsTo(models.Message, {
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
      },
    });
  };

  return Reaction;
};
