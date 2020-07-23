const Sequelize = require('sequelize');
const { setTimeout } = require('timers');
const User = require('./user');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const {
  DB,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_TYPE,
} = process.env;

module.exports = async () => {
  let maxReconnects = 10;
  let connected = false;

  const { Op } = Sequelize;
  const operatorsAliases = { $gt: Op.gt, $lt: Op.lt };
  const sequelize = new Sequelize(DB, DB_USER, DB_PASS, {
    protocol: DB_TYPE,
    dialect: DB_TYPE,
    host: DB_HOST,
    logging: false,
    operatorsAliases,
    ssl: true,
    define: {
      timestamps: true,
    },
  });

  while (!connected && maxReconnects) {
    try {
      sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log('reconnecting in 5 seconds');
      sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }
  // Define each model from external file
  const models = {
    User: sequelize.import('./user'),
    Code: sequelize.import('./code'),
    Group: sequelize.import('./group'),
    Member: sequelize.import('./member'),
    SubGroup: sequelize.import('./subGroup'),
    Channel: sequelize.import('./channel'),
    Message: sequelize.import('./message'),
    Comment: sequelize.import('./comment'),
    Reaction: sequelize.import('./reaction'),
  };
  // Associate each model
  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });
  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
};
