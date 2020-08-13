module.exports = (sequelize, DataTypes) => {
  return sequelize.define('member', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isNumeric: true,
        min: 0,
        max: 2,
      },
    },
  });
};
