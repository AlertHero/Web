const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0,
        max: 2,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          args: true,
          msg: 'The firstname can only contain letters',
        },
        len: {
          args: [2, 50],
          msg: 'The firstname must be between 2 and 50 characters long',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          args: true,
          msg: 'The lastname can only contain letters',
        },
        len: {
          args: [2, 50],
          msg: 'The lastname must be between 2 and 50 characters long',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: {
          args: true,
          msg: 'The phone number can only contain numbers',
        },
        len: {
          args: [10],
          msg: 'The phone number must be 10 characters long',
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['Mr.', 'Ms.', 'Miss', 'Mrs.', 'Dr.', 'Professor']],
          msg: 'Invalid Title type',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'Password must be between 5 and 100 characters long',
        },
      },
    },
    authyId: {
      type: DataTypes.STRING,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    latitude: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 },
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 },
    },
    employed: { type: DataTypes.BOOLEAN },
    workingNow: { type: DataTypes.BOOLEAN },
    version: { type: DataTypes.INTEGER },
  }, {
    hooks: {
      afterValidate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;     
      },
      afterBulkCreate: async (users) => {
        users.map(async (user) => {
          await User.update({ password: user.password }, { where: { email: user.email } });
        });
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Group, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
