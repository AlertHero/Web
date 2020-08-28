module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define(
    'alert',
    {
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
      userId: {
        type: DataTypes.INTEGER,
      },
      groupId: {
        type: DataTypes.INTEGER,
      },
      codeId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      hooks: {
        afterCreate: async (alert) => {
          sequelize.models.code.findAll().then(codes => {
            codes.map(code => {
              (code.id === alert.codeId)
                ? sequelize.models.code.update({ isActive: true }, {
                    where: { id: code.id }
                  })
                : sequelize.models.code.update({ isActive: false }, {
                    where: { id: code.id }
                  });
            });
          });
        }
      },
    }
  );

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
    Alert.belongsTo(models.Group, {
      foreignKey: {
        name: 'groupId',
        field: 'group_id',
      },
    });
  }

  return Alert;
};
