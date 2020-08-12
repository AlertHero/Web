module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    upvotes: {
      type: DataTypes.INTEGER,
    },
    downvotes: {
      type: DataTypes.INTEGER,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
    Message.belongsTo(models.Alert, {
      foreignKey: {
        name: 'alertId',
        field: 'alert_id',
      },
    });
  };

  return Message;
};