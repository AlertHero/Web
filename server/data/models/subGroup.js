module.exports = (sequelize, DataTypes) => {
  const SubGroup = sequelize.define('subGroup', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  SubGroup.associate = (models) => {
    SubGroup.belongsTo(models.Group, {
      foreignKey: {
        name: 'groupId',
        field: 'group_id',
      },
    });
  };

  return SubGroup;
};
