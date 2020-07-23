module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Channel.associate = (models) => {
    Channel.belongsTo(models.Group, {
      foreignKey: {
        name: 'groupId',
        field: 'group_id',
      },
    });
    Channel.belongsTo(models.SubGroup, {
      foreignKey: {
        name: 'subgroupId',
        field: 'subgroup_id',
      },
    });
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
  };

  return Channel;
};
