module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alertId: {
      type: DataTypes.INTEGER
    }
  });

  Comment.associate = (models) => {
    Comment.hasOne(models.Alert, {
      foreignKey: {
        name: 'alertId',
        field: 'alert_id',
      },
    });
  };

  return Comment;
};
