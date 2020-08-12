module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define('alert', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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

  Alert.associate = (models) => {
    Alert.hasOne(models.Code, {
      foreignKey: {
        name: 'codeId',
        field: 'code_id',
      },
    });
    Alert.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  }

  return Alert;
};
