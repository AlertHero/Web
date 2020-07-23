module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comment', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Message, {
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
      },
    });
  };
};
