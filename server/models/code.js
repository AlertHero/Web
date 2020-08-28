module.exports = (sequelize, DataTypes) => {
  const Code = sequelize.define('code', {
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Code;
};