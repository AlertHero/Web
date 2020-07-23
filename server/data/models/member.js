module.exports = (sequelize, DataTypes) => {
  return sequelize.define('member', {
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
