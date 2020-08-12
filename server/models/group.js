module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: {
        name: 'groupId',
        field: 'group_id',
      },
    });
  };

  return Group;
};
